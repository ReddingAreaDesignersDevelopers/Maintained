import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Client } from '/imports/api/clients';

Meteor.publish('/clients/list', () => Client.find());

Meteor.publish('/clients/view', clientId => {
	check(clientId, String);
	const cursors = [];
	const client = Client.findOne(clientId);
	cursors.push(Client.find(clientId));
	cursors.push(client.credentials());
	return cursors;
});
