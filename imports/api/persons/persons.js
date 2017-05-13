// A person is a single real person with whom the agency is associated
// They may have roles at one or more clients or properties

import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '../helpers.js';

const Persons = new Mongo.Collection('persons');

const PersonRole = GenericDashObject.inherit({
	name: 'Person Role',
	fields: {
		name: String,
		objectId: Mongo.ObjectID,
		objectType: String
	}
});

const Person = GenericDashObject.inherit({
	name: 'Person',
	collection: Persons,
	fields: {
		name: String,
		roles: [PersonRole],
		uniquePhysicalAddresses: [PhysicalAddress],
		uniqueEmailAddresses: [EmailAddress],
		uniquePhoneNumbers: [PhoneNumber],
	}
});

export { Persons, PersonRole, Person };
