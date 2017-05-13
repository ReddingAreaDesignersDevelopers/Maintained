// A client is a single organization with whom the agency does business

import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '../helpers.js';

const Clients = new Mongo.Collection('clients');

const Client = GenericDashObject.inherit({
	name: 'Client',
	collection: Clients,
	fields: {
		credentialIds: {
			type: [Mongo.ObjectID],
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
		}
	},
	helpers: {
		persons () {
			return Person.find({'roles.$.objectId': this._id});
		}
	}
});

export { Clients, Client };
