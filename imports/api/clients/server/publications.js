import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Client } from '/imports/api/clients';

// Publishes all clients to the server TODO restrict number of fields passed
Meteor.publish('/clients/list', () => Client.find());

// Publishes a single client to the server along with associated documents
Meteor.publish('/clients/view', clientId => {
	check(clientId, String);
	const cursors = [];
	const client = Client.findOne(clientId);
	cursors.push(Client.find(clientId));
	cursors.push(client.credentials());
	cursors.push(client.persons());
	return cursors;
});
