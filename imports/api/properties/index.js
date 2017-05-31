import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers.js';

import { Client } from '/imports/api/clients';
import { Credential } from '/imports/api/credentials';

// Create the mongo collection to store properties
const Properties = new Mongo.Collection('properties');

// The type of property, general categories in increments of 10
// sub-types within those general categories
const PropertyType = Enum.create({
	name: 'Property Type',
	identifiers: {
		WEB: 0,
		WEB_SITE: 1,
		WEB_APPLICATION: 2,
		PRINT: 10,
		PRINT_BROCHURE: 11,
		PRINT_FLYER: 12,
		VIDEO: 20,
		VIDEO_PROMOTION: 21,
		VIDEO_INSTRUCTION: 22,
	}
});

// A URL associated with a property
// This may be any URL, like the project site
// or a portfolio item URL
const PropertyURL = GenericDashObject.inherit({
	name: 'Property URL',
	fields: {
		address: String
	}
});

// The project status of a property,
// for instance if it is on hold
const PropertyStatus = Enum.create({
	name: 'Property Status',
	identifiers: {
		PENDING: 0,
		ACTIVE: 10,
		INACTIVE: 20,
		ARCHIVED: 30
	}
});

// A color associated with a property,
// such as a brand color
const StyleColor = GenericDashObject.inherit({
	name: 'Style Color',
	fields: {
		value: {
			 // A description of the color
			type: String,
			default: '#ffffff'
		}
	}
});

// A font (instance of a typeface) associated with a property,
// such as 12px bold helvetica
const StyleFont = GenericDashObject.inherit({
	name: 'Style Font',
	fields: {
		size: {
			type: String,
			default: '1em'
		},
		weight: {
			type: String,
			default: 'normal'
		},
		style: {
			type: String,
			default: 'normal'
		}
	}
});

// A typeface associated with a property,
// such as helvetica
const StyleTypeface = GenericDashObject.inherit({
	name: 'Style Typeface',
	fields: {
		name: String,
		fonts: {
			type: [StyleFont],
			default: () => []
		}
	}
});

// A set of styles associated with a property,
// both colors and type
const PropertyStyle = Class.create({
	name: 'Property Style',
	fields: {
		colors: {
			type: [StyleColor],
			default: () => []
		},
		typefaces: {
			type: [StyleTypeface],
			default: () => []
		}
	}
});

// A property is a single piece of intellectual property belonging to a single client
const Property = GenericDashObject.inherit({
	name: 'Property',
	collection: Properties,
	fields: {
		name: String, // The name of the property
		propertyType: {
			type: PropertyType,
			default: PropertyType.WEB
		},
		urls: {
			type: [PropertyURL],
			default: () => []
		},
		clientId: String, // The id of a client who owns the property
		credentialIds: {
			type: [String], // TODO this should be a Mongo.ObjectID but validation isn't working
			default: () => []
		},
		uniquePhysicalAddresses: {
			 // An array of physical addresses unique to the property, like the printer's
			type: [PhysicalAddress],
			default: () => []
		},
		uniqueEmailAddresses: {
			 // An array of email addresses unique to the property
			type: [EmailAddress],
			default: () => []
		},
		uniquePhoneNumbers: {
			 // An array of phone numbers unique to the property
			type: [PhoneNumber],
			default: () => []
		},
		serviceIds: {
			 // An array of services offered by the agency which the property utilizes
			type: [String],
			default: () => []
		},
		status: {
			type: PropertyStatus,
			default: PropertyStatus.ACTIVE
		},
		style: {
			type: PropertyStyle,
			default: () => new PropertyStyle()
		},
		images: {
			 // An array of images associated with the property
			type: [Object],
			default: () => []
		},
		physicalAddresses: {
			// A transient property which merges the client's physical addresses with the property's unique ones
			type: [PhysicalAddress],
			transient: true,
			resolve (doc) {
				let physicalAddresses;
				const client = Client.findOne({_id: doc.clientId});
				if(client) {
					physicalAddresses = _.union(doc.uniquePhysicalAddresses, client.physicalAddresses);
				}
				return physicalAddresses;
			}
		},
		emailAddresses: {
			// A transient property which merges the client's email addresses with the property's unique ones
			type: [EmailAddress],
			transient: true,
			resolve (doc) {
				let emailAddresses;
				const client = Client.findOne({_id: doc.clientId});
				if(client) {
					emailAddresses = _.union(doc.uniqueEmailAddresses, client.EmailAddresses);
				}
				return emailAddresses;
			}
		},
		phoneNumbers: {
			// A transient property which merges the client's phone numbers with the property's unique ones
			type: [PhoneNumber],
			transient: true,
			resolve (doc) {
				let phoneNumbers;
				const client = Client.findOne({_id: doc.clientId});
				if(client) {
					phoneNumbers = _.union(doc.uniquePhoneNumbers, client.phoneNumbers);
				}
				return phoneNumbers;
			}
		},
		url: {
			// A transient property for the application URL
			type: String,
			transient: true,
			resolve (doc) {
				return `/properties/${doc._id}`;
			}
		}
	},
	helpers: {
		client () {
			// Returns the client object associated with the property
			return Client.findOne({_id: this.clientId});
		},
		persons () {
			// Returns a cursor of persons associated with the property
			return Person.find({'roles.$.objectId': this._id});
		},
		credentials () {
			// Returns a cursor of credentials attached to the property
			return Credential.find({_id: {$in: this.credentialIds}});
		}
	}
});


if(Meteor.isServer) {
	Property.extend({
		// The methods below are for adding, updating, and removing child classes
		// These methods are invoked on the client so as to provide shorthand
		// for updating this, secured, class
		meteorMethods: {
			addCredential (credentialId) {
				this.credentialIds.push(credentialId);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			removeCredential (credential) {
				// A method for removing a credential associated with the client,
				// and removing the link between the now non-existent credential

				// If a string was passed, guess that it may have been the id
				if(typeof credential === 'string') credential = Credential.findOne(credential);
				if(!credential) throw new Meteor.Error('Credential not found');
				const credentialId = credential._id;
				credential.remove(error => {
					if(error) throw new Meteor.Error(error);
					// Now remove the credential ID from the client object
					this.credentialIds.splice(this.credentialIds.indexOf(credentialId), 1);
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				});
			},
			addPhysicalAddress (physicalAddress) {
				this.uniquePhysicalAddresses.push(physicalAddress);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			updatePhysicalAddress (physicalAddress, index) {
				this.uniquePhysicalAddresses[index] = physicalAddress;
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
 			removePhysicalAddress (physicalAddressIndex) {
				// Removes a physical address from the client object via its index
				this.uniquePhysicalAddresses.splice(physicalAddressIndex, 1);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			addEmailAddress (emailAddress) {
				this.uniqueEmailAddresses.push(emailAddress);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			updateEmailAddress (emailAddress, index) {
				this.uniqueEmailAddresses[index] = emailAddress;
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
 			removeEmailAddress (emailAddressIndex) {
				// Removes a email address from the client object via its index
				this.uniqueEmailAddresses.splice(emailAddressIndex, 1);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			addPhoneNumber (phoneNumber) {
				this.uniquePhoneNumbers.push(phoneNumber);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			updatePhoneNumber (phoneNumber, index) {
				this.uniquePhoneNumbers[index] = phoneNumber;
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
 			removePhoneNumber (phoneNumberIndex) {
				// Removes a phone number from the client object via its index
				this.uniquePhoneNumbers.splice(phoneNumberIndex, 1);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			}
		}
	});
}

export { Properties, PropertyType, PropertyStatus, StyleColor, StyleFont, StyleTypeface, PropertyStyle, Property };