import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { User } from '/imports/api/users/users.js';

if(Meteor.isServer) {
	Meteor.startup(() => {
		if(!Meteor.users.find().fetch().length) {
			Accounts.createUser({
				email: 'admin@dash.local',
				password: 'password',
				profile: {
					name: 'Administrator'
				}
			});
		}
	})
}
