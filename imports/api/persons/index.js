import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers.js';

const Persons = new Mongo.Collection('persons');

// A person may have any number of roles. These are positions for example,
// at a client organization or with a property
const PersonRole = GenericDashObject.inherit({
	name: 'Person Role',
	fields: {
		name: String, // The name of their role
		objectType: String, // The type of object at which they have a role (site or client)
		objectId: String // The ID of the object above
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
		uniquePhysicalAddresses: [PhysicalAddress], // Physical addresses unique to the person (not at their role)
		uniqueEmailAddresses: [EmailAddress], // Email addresses like above
		uniquePhoneNumbers: [PhoneNumber], // Phone numbers like above
	}
});

export { Persons, PersonRole, Person };
