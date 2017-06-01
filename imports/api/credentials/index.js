import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers.js';

// Create the Mongo collection
const Credentials = new Mongo.Collection('credentials');

// Credential types are used to categorize credentials.
// This is for easy filtering and possible view extension
const CredentialType = Enum.create({
	name: 'Credential Type',
	identifiers: {
		'SOCIAL': 0, // A login to a social network
		'SERVICE': 10, // A login to an arbitrary service, like a directory listing
		'DOMAIN': 20, // A login to manage a domain
		'HOSTING': 30, // A login to manage hosting
		'FTP': 31, // A login to access files
		'DATABASE': 40, // A login to manage the database
		'CMS': 50, // A login to the CMS
		'EMAIL': 60, // An email login
		'OTHER': 70, // Any other kind of login
	}
});

// A credential is a single piece of authentication
// It must be related to a URL and have a password
// It may also have a username associated
const Credential = GenericDashObject.inherit({
	name: 'Credential',
	collection: Credentials,
	fields: {
		url: String, // The URL for which the credential will be used
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

const extendWithCredentials = classToExtend => {
	classToExtend.extend({
		fields: {
			credentialIds: {
				type: [String], // TODO this should be a Mongo.ObjectID but validation isn't working
				default: () => []
			},
		}
	});
	if(Meteor.isServer) {
		classToExtend.extend({
			// The methods below are for adding, updating, and removing child classes
			// These methods are invoked on the client so as to provide shorthand
			// for updating this, secured, class
			meteorMethods: {
				addCredential (credentialId) {
					this.credentialIds.push(credentialId);
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				},
				removeCredential (credential) {
					// A method for removing a credential associated with the client,
					// and removing the link between the now non-existent credential

					// If a string was passed, guess that it may have been the id
					if(typeof credential === 'string') credential = Credential.findOne(credential);
					if(!credential) throw new Meteor.Error('Credential not found');
					const credentialId = credential._id;
					credential.remove(error => {
						if(error) throw new Meteor.Error(error);
						// Now remove the credential ID from the client object
						this.credentialIds.splice(this.credentialIds.indexOf(credentialId), 1);
						this.save(error => {
							if(error) throw new Meteor.Error(error);
						});
					});
				},

			}
		});
	}
}

export { Credentials, CredentialType, Credential, extendWithCredentials };
