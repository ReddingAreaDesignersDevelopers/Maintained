import GenericDashObject from '/imports/api/GenericDashObject';

// An emailAddress is an email address associated with a client or property
// It may contain a link to a credential for logging into it
const EmailAddress = GenericDashObject.inherit({
	name: 'Email Address',
	fields: {
		address: String, // TODO validation
		domain: {
			// A transient property storing the domain of the address
			type: String,
			transient: true,
			resolve (doc) {
				// There's only one @ in an email address
				return doc.address.split('@')[1];
			}
		},
		credentialId: {
			type: String,
			optional: true
		}
	},
	helpers: {
		credential () {
			var credential = undefined;
			if(this.credentialId) {
				credential = Credential.findOne(this.credentialId);
			} else {
				// If no credential associated, help the user by creating a blank one
				// It won't save because there is no password field
				credential = new Credential({
					url: this.domain,
					credentialType: CredentialType.EMAIL
				});
			}
			return credential;
		}
	}
});

export default EmailAddress;
