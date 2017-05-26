import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers.js';

import { Credential } from '/imports/api/credentials';
import { Person } from '/imports/api/persons';

// Create the mongo collection of clients
const Clients = new Mongo.Collection('clients');

// A client is a single organization with whom the agency does business
const Client = GenericDashObject.inherit({
	name: 'Client',
	collection: Clients,
	fields: {
		name: {
			type: String // The name of the client, which is required
		},
		credentialIds: {
			type: [String], // TODO this should be a Mongo.ObjectID but validation isn't working
			default: () => []
		},
		physicalAddresses: {
			type: [PhysicalAddress], // An array of physical addresses associated with the client
			default: () => []
		},
		emailAddresses: {
			type: [EmailAddress], // An array of email addresses associated with the client
			default: () => []
		},
		phoneNumbers: {
			type: [PhoneNumber], // An array of phone numbers associated with the client
			default: () => []
		},
		referral: {
			type: String, // The way in which the client was referred to the agency
			default: ''
		},
		url: {
			// A transient property for returning the application URL to view the client
			type: String,
			transient: true,
			resolve (doc) {
				return `/clients/${doc._id}`;
			}
		}
	},
	helpers: {
		persons () {
			// Returns a cursor of persons associated with the client
			return Person.find({'roles.$.objectId': this._id});
		},
		credentials () {
			// Returns a cursor of credentials attached to the client
			return Credential.find({_id: {$in: this.credentialIds}});
		}
	}
});

if(Meteor.isServer) {
	Client.extend({
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
				this.physicalAddresses.push(physicalAddress);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			updatePhysicalAddress (physicalAddress, index) {
				this.physicalAddresses[index] = physicalAddress;
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
 			removePhysicalAddress (physicalAddressIndex) {
				// Removes a physical address from the client object via its index
				this.physicalAddresses.splice(physicalAddressIndex, 1);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			addEmailAddress (emailAddress) {
				this.emailAddresses.push(emailAddress);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			updateEmailAddress (emailAddress, index) {
				this.emailAddresses[index] = emailAddress;
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
 			removeEmailAddress (emailAddressIndex) {
				// Removes a email address from the client object via its index
				this.emailAddresses.splice(emailAddressIndex, 1);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			addPhoneNumber (phoneNumber) {
				this.phoneNumbers.push(phoneNumber);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
			updatePhoneNumber (phoneNumber, index) {
				this.phoneNumbers[index] = phoneNumber;
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			},
 			removePhoneNumber (phoneNumberIndex) {
				// Removes a phone number from the client object via its index
				this.phoneNumbers.splice(phoneNumberIndex, 1);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			}
		}
	});
}

export { Clients, Client };
