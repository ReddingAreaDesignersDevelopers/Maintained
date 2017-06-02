import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import User from '/imports/api/User';

if(Meteor.isServer) {
	Meteor.startup(() => {
		if(!Meteor.users.find().fetch().length) {
			// If there are no users, create a default user
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
