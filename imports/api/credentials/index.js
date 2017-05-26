// A credential is a single piece of authentication

import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers.js';

const Credentials = new Mongo.Collection('credentials');

const CredentialType = Enum.create({
	name: 'Credential Type',
	identifiers: [
		'SOCIAL',
		'SERVICE',
		'DOMAIN',
		'HOSTING',
		'DATABASE',
		'CMS',
		'EMAIL',
		'OTHER'
	]
});

const Credential = GenericDashObject.inherit({
	name: 'Credential',
	collection: Credentials,
	fields: {
		url: String,
		user: {
			type: String,
			optional: true
		},
		password: String, // Any arbitrary string (PGP, password, &c)
		credentialType: {
			type: CredentialType,
			default: CredentialType.OTHER
		}
	}
});

export { Credentials, CredentialType, Credential };
