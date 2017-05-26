import { Meteor } from 'meteor/meteor';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { GenericDashObject } from '/imports/api/helpers.js';

// A user is someone who can log into the dash
const User = GenericDashObject.inherit({
	name: 'User',
	collection: Meteor.users,
	fields: {
		name: {
			type: String // Users must have a name
		},
		services: Object, // Used by Meteor
		profile: Object, // Used by Meteor. Created on signup
		emails: {
			type: [Object] // An array of {address: String, verified: Boolean}
		},
		email: {
			// Transient property for getting the first email of the user
			type: String,
			transient: true,
			resolve (doc) {
				return doc.emails && doc.emails[0] ? doc.emails[0].address : '';
			}
		}
	}
});

export { User };
