// A client is a single organization with whom the agency does business

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers.js';

import { Credential } from '/imports/api/credentials';

const Clients = new Mongo.Collection('clients');

const Client = GenericDashObject.inherit({
	name: 'Client',
	collection: Clients,
	fields: {
		name: {
			type: String
		},
		credentialIds: {
			type: [String], // TODO this should be a Mongo.ObjectID but validation isn't working
			default: () => []
		},
		physicalAddresses: {
			type: [PhysicalAddress],
			default: () => []
		},
		emailAddresses: {
			type: [EmailAddress],
			default: () => []
		},
		phoneNumbers: {
			type: [PhoneNumber],
			default: () => []
		},
		referral: {
			type: String,
			default: ''
		},
		url: {
			type: String,
			transient: true,
			resolve (doc) {
				return `/clients/${doc._id}`;
			}
		}
	},
	helpers: {
		persons () {
			return Person.find({'roles.$.objectId': this._id});
		},
		credentials () {
			return Credential.find({_id: {$in: this.credentialIds}});
		}
	}
});

if(Meteor.isServer) {
	Client.extend({
		meteorMethods: {
			removeCredential (credential) {
				// If a string was passed, guess that it may have been the id
				if(typeof credential === 'string') credential = Credential.findOne(credential);
				if(!credential) throw new Meteor.Error('Credential not found');
				const credentialId = credential._id;
				credential.remove(error => {
					if(error) throw new Meteor.Error(error);
					this.credentialIds.splice(this.credentialIds.indexOf(credentialId), 1);
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				});
			},
			removePhysicalAddress (physicalAddressIndex) {
				this.physicalAddresses.splice(physicalAddressIndex, 1);
				this.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			}
		}
	});
}

export { Clients, Client };
