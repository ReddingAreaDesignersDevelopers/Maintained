import React from 'react';

import User from '/imports/api/User';

import container from '/imports/ui/modules/container';

const UserView = ({ user }) => (<h1>{user.name}</h1>);

export default container(({match}, onData) => {
	// Get the data from the server before showing anything
	console.log(match);
	const subscription = Meteor.subscribe('/users/view', match.params.userId);
	if(subscription.ready()) {
		const user = User.findOne(match.params.userId);
		onData(null, {user});
	}
}, UserView);
