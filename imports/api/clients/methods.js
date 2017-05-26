import { Meteor } from 'meteor/meteor';
import { Client } from '/imports/api/clients';

if(Meteor.isServer) {
	Meteor.methods({
		'/clients/save' (client) {
			if(typeof client === 'string') client = Client.findOne(client);
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
		'/clients/delete' (client) {
			if(typeof client === 'string') client = Client.findOne(client);
			client.remove(error => {
				if(error) {
					throw new Meteor.Error(error);
				}
			});
			return;
		}
	});
}
