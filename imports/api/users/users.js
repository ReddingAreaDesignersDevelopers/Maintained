import { Meteor } from 'meteor/meteor';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { GenericDashObject } from '/imports/api/helpers.js';

const User = GenericDashObject.inherit({
	name: 'User',
	collection: Meteor.users,
	fields: {
		name: {
			type: String
		},
		services: Object,
		profile: Object,
		emails: {
			type: [Object]
		},
		email: {
			type: String,
			transient: true,
			resolve (doc) {
				return doc.emails && doc.emails[0] ? doc.emails[0].address : '';
			}
		}
	}
});

export { User };
