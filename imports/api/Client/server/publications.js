// http://docs.meteor.com/api/pubsub.html

import { Meteor } from 'meteor/meteor';

import Client from '/imports/api/Client';

// Publishes all clients to the server TODO restrict number of fields passed
Meteor.publish('/clients/list', () => Client.find());

// Publishes a single client to the server along with associated documents
Meteor.publish('/clients/view', client => {
	if(typeof client === 'string') client = Client.findOne(client);
	const cursors = [];
	cursors.push(Client.find(client._id));
	cursors.push(client.credentials());
	cursors.push(client.persons());
	cursors.push(client.properties());// TODO reduce number of fields
	return cursors;
});

Meteor.publish('/clients/search', search => {
	// Allows searching by client name for use attaching to properties
	return Client.find({
		$text: {
			$search: search,
			$caseSensitive: false
		}
	}, {
		fields: {
			score: {$meta: 'textScore'},
		},
		sort: {
			score: {$meta: 'textScore'}
		}
	});
})
