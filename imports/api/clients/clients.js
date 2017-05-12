// A client is a single organization with whom the agency does business

import { Mongo } from 'mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

const Clients = new Mongo.Collection('clients');

const Client = GenericDashObject.inherit({
	name: 'Client',
	collection: Clients,
	fields: {
		credentialIds: [Mongo.ObjectID],
		physicalAddresses: [PhysicalAddress],
		emailAddresses: [EmailAddresses],
		phoneNumbers: [PhoneNumbers],
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
