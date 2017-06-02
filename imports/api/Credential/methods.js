// http://docs.meteor.com/api/methods.html

import { Meteor } from 'meteor/meteor';

import Credential from '/imports/api/Credential';

Meteor.methods({
	'/credentials/create' (credential) {
		// Create the credential. Returns the new ID if successful.
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
	'/credentials/save' (credential) {
		// Saves a credential. Tests for the possibility of an ID being passed
		if(typeof credential === 'string') credential = Credential.findOne(credential);
		let result = undefined;
		credential.save(error => {
			if(error) {
				throw new Meteor.Error(error);
			}
		});
		return result;
	},
	'/credentials/delete' (credential) {
		// Deletes a credential. Tests for the possibility of an ID being passed
		if(typeof credential === 'string') credential = Credential.findOne(credential);
		credential.remove(error => {
			if(error) {
				throw new Meteor.Error(error);
			}
		});
		return;
	}
});
