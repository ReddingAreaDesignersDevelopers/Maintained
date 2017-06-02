// http://docs.meteor.com/api/pubsub.html

import { Meteor } from 'meteor/meteor';

import Property from '/imports/api/Property';
import Client from '/imports/api/Client';

Meteor.publish('/properties/list', () => Property.find());

Meteor.publish('/properties/view', property => {
	if(typeof property === 'string') property = Property.findOne(property);
	const cursors = [];
	cursors.push(Property.find(property._id));
	cursors.push(Client.find(property.clientId))
	cursors.push(property.credentials());
	return cursors;
});
