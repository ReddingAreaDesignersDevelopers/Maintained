// A property is a single piece of intellectual property belonging to a single client

import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers.js';

const Properties = new Mongo.Collection('properties');

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

const PropertyURL = GenericDashObject.inherit({
	name: 'Property URL',
	fields: {
		address: String
	}
});

const PropertyStatus = Enum.create({
	name: 'Property Status',
	identifiers: {
		pending: 0,
		active: 10,
		inactive: 20,
		archived: 30
	}
});

const StyleColor = GenericDashObject.inherit({
	name: 'Style Color',
	fields: {
		value: String
	}
});

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

const StyleTypeface = GenericDashObject.inherit({
	name: 'Style Typeface',
	fields: {
		name: String,
		fonts: [StyleFont]
	}
});

const PropertyStyle = Class.create({
	name: 'Property Style',
	fields: {
		colors: [StyleColor],
		typefaces: [StyleTypeface]
	}
});

const Property = GenericDashObject.inherit({
	name: 'Property',
	collection: Properties,
	fields: {
		name: String,
		propertyType: PropertyType,
		urls: [PropertyURL],
		clientId: Mongo.ObjectID,
		uniquePhysicalAddresses: [PhysicalAddress],
		uniqueEmailAddresses: [EmailAddress],
		uniquePhoneNumbers: [PhoneNumber],
		serviceIds: [Mongo.ObjectID],
		status: {
			type: PropertyStatus,
			default: PropertyStatus.acive
		},
		style: PropertyStyle,
		images: [Object],
		physicalAddresses: {
			type: [PhysicalAddress],
			resolve (doc) {
				const client = Client.findOne({_id: doc.clientId});
				return _.union(doc.uniquePhysicalAddresses, client.physicalAddresses);
			}
		},
		emailAddresses: {
			type: [EmailAddress],
			resolve (doc) {
				const client = Client.findOne({_id: doc.clientId});
				return _.union(doc.uniqueEmailAddresses, client.EmailAddresses);
			}
		},
		phoneNumbers: {
			type: [PhoneNumber],
			resolve (doc) {
				const client = Client.findOne({_id: doc.clientId});
				return _.union(doc.uniquePhoneNumbers, client.phoneNumbers);
			}
		}
	},
	helpers: {
		client () {
			return Client.findOne({_id: this.clientId});
		},
		persons () {
			return Person.find({'roles.$.objectId': this._id});
		}
	}
});

export { Properties, PropertyType, PropertyStatus, StyleColor, StyleFont, StyleTypeface, PropertyStyle, Property };
