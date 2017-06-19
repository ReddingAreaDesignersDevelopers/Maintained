import { Meteor } from 'meteor/meteor';
import { Class, Enum } from 'meteor/jagi:astronomy';

export const UserCapability = Enum.create({
	name: 'User Capability',
	identifiers: {
		MANAGE_USERS: 0
	}
});

// A user is someone who can log into the dash
const User = Class.create({
	name: 'User',
	collection: Meteor.users,
	fields: {
		name: {
			type: String, // Users must have a name
			transient: true,
			resolve (doc) {
				return doc.profile.name
			}
		},
		capabilities: {
			type: [UserCapability],
			default: () => []
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

export default User;
