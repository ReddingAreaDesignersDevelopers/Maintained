import { Meteor } from 'meteor/meteor';

import User from '/imports/api/User';

Meteor.publish('/users/list', function () {
	return User.find();
});

Meteor.publish('/users/view', function (userId) {
	return User.find({_id: userId});
});
