import { Meteor } from 'meteor/meteor';
import { Client } from '/imports/api/clients';

Meteor.methods({
	'/clients/create' (client) {
		// Creates a client
		let result = undefined;
		client.save((error, clientId) => {
			if(error) {
				throw new Meteor.Error(error);
			} else {
				result = clientId;
			}
		});
		return result;
	},
	'/clients/save' (client) {
		// Saves a single client. Checks for the possibility of a clientId being
		// passed instead of a full client object
		if(typeof client === 'string') client = Client.findOne(client);
		client.save(error => {
			if(error) throw new Meteor.Error(error);
		});
		return;
	},
	'/clients/delete' (client) {
		// Deletes a single client. Checks for the possibility of a clientId being
		// passed instead of a full client object
		if(typeof client === 'string') client = Client.findOne(client);
		client.remove(error => {
			if(error) {
				throw new Meteor.Error(error);
			}
		});
		return;
	},

});
