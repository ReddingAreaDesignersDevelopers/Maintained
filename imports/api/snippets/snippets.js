import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers.js';

const Snippets = new Mongo.Collection('snippets');

const Snippet = GenericDashObject.inherit({
	name: 'Snippet',
	collection: Snippets,
	fields: {}
});

export { Snippets, Snippet };
