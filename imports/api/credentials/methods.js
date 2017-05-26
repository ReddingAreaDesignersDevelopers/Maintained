import { Meteor } from 'meteor/meteor';
import { Credential } from '/imports/api/credentials';

if(Meteor.isServer) {
	Meteor.methods({
		'/credentials/save' (credential) {
			if(typeof credential === 'string') credential = Credential.findOne(credential);
			let result = undefined;
			credential.save((error, credentialId) => {
				if(error) {
					throw new Meteor.Error(error);
				} else {
					result = credentialId;
				}
			});
			return result;
		},
		'/credentials/delete' (credential) {
			if(typeof credential === 'string') credential = Credential.findOne(credential);
			credential.remove(error => {
				if(error) {
					throw new Meteor.Error(error);
				}
			});
			return;
		}
	});
}
