// A person is a single real person with whom the agency is associated
// They may have roles at one or more clients or properties

import { Mongo } from 'mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

const Persons = new Mongo.Collection('persons');

const PersonRole = GenericDashObject.inherit({
	name: 'Person Role',
	fields: {
		name: String,
		objectId: Mongo.ObjectId,
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
