import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { GenericDashObject, extendWithPhoneNumbers, extendWithEmailAddresses, extendWithPhysicalAddresses } from '/imports/api/helpers.js';

import { extendWithCredentials, Credential } from '/imports/api/credentials';
import { Person } from '/imports/api/persons';
import { Property } from '/imports/api/properties';

// Create the mongo collection of clients
const Clients = new Mongo.Collection('clients');

// A client is a single organization with whom the agency does business
const Client = GenericDashObject.inherit({
	name: 'Client',
	collection: Clients,
	fields: {
		name: {
			type: String // The name of the client, which is required
		},
		referral: {
			type: String, // The way in which the client was referred to the agency
			default: ''
		},
		url: {
			// A transient property for returning the application URL to view the client
			type: String,
			transient: true,
			resolve (doc) {
				return `/clients/${doc._id}`;
			}
		}
	},
	helpers: {
		persons () {
			// Returns a cursor of persons associated with the client
			return Person.find({'roles.$.objectId': this._id});
		},
		credentials () {
			// Returns a cursor of credentials attached to the client
			return Credential.find({_id: {$in: this.credentialIds}});
		},
		properties () {
			// Returns a cursor of properties owned by the client
			return Property.find({clientId: this._id});
		}
	}
});

extendWithCredentials(Client);
extendWithPhysicalAddresses(Client);
extendWithEmailAddresses(Client);
extendWithPhoneNumbers(Client);


export { Clients, Client };
