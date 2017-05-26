import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers.js';

// Create the mongo collection to store properties
const Properties = new Mongo.Collection('properties');

// The type of property, general categories in increments of 10
// sub-types within those general categories
const PropertyType = Enum.create({
	name: 'Property Type',
	identifiers: {
		web: 0,
		webSite: 1,
		webApplication: 2,
		print: 10,
		printBrochure: 11,
		printFlyer: 12,
		video: 20,
		videoPromotion: 21,
		videoInstruction: 22
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
		pending: 0,
		active: 10,
		inactive: 20,
		archived: 30
	}
});

// A color associated with a property,
// such as a brand color
const StyleColor = GenericDashObject.inherit({
	name: 'Style Color',
	fields: {
		value: String // A description of the color
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
		fonts: [StyleFont]
	}
});

// A set of styles associated with a property,
// both colors and type
const PropertyStyle = Class.create({
	name: 'Property Style',
	fields: {
		colors: [StyleColor],
		typefaces: [StyleTypeface]
	}
});

// A property is a single piece of intellectual property belonging to a single client
const Property = GenericDashObject.inherit({
	name: 'Property',
	collection: Properties,
	fields: {
		name: String, // The name of the property
		propertyType: PropertyType, // The type of property
		urls: [PropertyURL], // An array of URLs associated with the property
		clientId: Mongo.ObjectID, // The id client who owns the property
		uniquePhysicalAddresses: [PhysicalAddress], // An array of physical addresses unique to the property, like the printer's
		uniqueEmailAddresses: [EmailAddress], // An array of email addresses unique to the property
		uniquePhoneNumbers: [PhoneNumber], // An array of phone numbers unique to the property
		serviceIds: [Mongo.ObjectID], // An array of services offered by the agency which the property utilizes
		status: {
			type: PropertyStatus,
			default: PropertyStatus.active
		},
		style: PropertyStyle,
		images: [Object], // An array of images associated with the property
		physicalAddresses: {
			// A transient property which merges the client's physical addresses with the property's unique ones
			type: [PhysicalAddress],
			transient: true,
			resolve (doc) {
				const client = Client.findOne({_id: doc.clientId});
				return _.union(doc.uniquePhysicalAddresses, client.physicalAddresses);
			}
		},
		emailAddresses: {
			// A transient property which merges the client's email addresses with the property's unique ones
			type: [EmailAddress],
			transient: true,
			resolve (doc) {
				const client = Client.findOne({_id: doc.clientId});
				return _.union(doc.uniqueEmailAddresses, client.EmailAddresses);
			}
		},
		phoneNumbers: {
			// A transient property which merges the client's phone numbers with the property's unique ones
			type: [PhoneNumber],
			transient: true,
			resolve (doc) {
				const client = Client.findOne({_id: doc.clientId});
				return _.union(doc.uniquePhoneNumbers, client.phoneNumbers);
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
		}
	}
});

export { Properties, PropertyType, PropertyStatus, StyleColor, StyleFont, StyleTypeface, PropertyStyle, Property };
