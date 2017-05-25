import { Meteor } from 'meteor/meteor';

if(Meteor.isServer) {
	Meteor.methods({
		'/clients/list' () {
			return Client.find();
		},
		'/clients/save' (client) {
			let result = undefined;
			client.save((error, id) => {
				if(error) {
					throw new Meteor.Error(error);
				} else {
					result = id;
				}
			});
			return result;
		}
	})
}
