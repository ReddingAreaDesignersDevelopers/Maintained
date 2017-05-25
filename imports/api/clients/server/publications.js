import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Client } from '/imports/api/clients/clients';

Meteor.publish('/clients/list', () => Client.find());

Meteor.publish('/clients/view', clientId => {
	console.log('finding', clientId);
	check(clientId, String);
	return Client.find(clientId);
});
