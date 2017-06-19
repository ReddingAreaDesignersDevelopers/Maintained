import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import GenericDashObject from '/imports/api/GenericDashObject';
import collectionByName from '/imports/api/helpers/collectionByName';
import Client from '/imports/api/Client';
import Property from '/imports/api/Property';

import { extendWithPhoneNumbers, extendWithEmailAddresses, extendWithPhysicalAddresses } from '/imports/api/helpers';

export const Persons = new Mongo.Collection('persons');

// A person may have any number of roles. These are positions for example,
// at a client organization or with a property
export const PersonRole = GenericDashObject.inherit({
	name: 'Person Role',
	fields: {
		name: String, // The name of their role
		objectType: String, // The type of object at which they have a role (property or client)
		objectId: String // The ID of the object above
	},
	helpers: {
		object () {
			return collectionByName(this.objectType).findOne(this.objectId);
		}
	}
});

// A person is a single real person with whom the agency is associated
// They may have roles at one or more clients or properties
const Person = GenericDashObject.inherit({
	name: 'Person',
	collection: Persons,
	fields: {
		name: String, // The person's name
		roles: [PersonRole], // Any number of roles they may hold
		url: {
			type: String,
			transient: true,
			resolve: doc => `/persons/${doc._id}`
		}
	},
	helpers: {
		clients () {
			const clientIds = _.filter(this.roles, role => role.objectType === 'Client').map(role => role.objectId);
			return Client.find({_id: {$in: clientIds}});
		},
		properties () {
			const propertyIds = _.filter(this.roles, role => role.objectType === 'Property').map(role => role.objectId);
			return Property.find({_id: {$in: propertyIds}});
		},
		roleAt (object) {
			const role = _.findWhere(this.roles, {objectId: object._id});
			return role;
		}
	}
});

extendWithPhysicalAddresses(Person);
extendWithEmailAddresses(Person);
extendWithPhoneNumbers(Person);

export default Person;
