import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Property } from '/imports/api/properties';
import { Client } from '/imports/api/clients';

Meteor.publish('/properties/list', () => Property.find());

Meteor.publish('/properties/view', property => {
	if(typeof property === 'string') property = Property.findOne(property);
	const cursors = [];
	cursors.push(Property.find(property._id));
	cursors.push(Client.find(property.clientId))
	cursors.push(property.credentials());
	return cursors;
});
