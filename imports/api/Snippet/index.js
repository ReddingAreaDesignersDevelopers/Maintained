import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import GenericDashObject from '/imports/api/GenericDashObject';
import { PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers';

export const Snippets = new Mongo.Collection('snippets');

const Snippet = GenericDashObject.inherit({
	name: 'Snippet',
	collection: Snippets,
	fields: {}
});

export default Snippet;
