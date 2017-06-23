// This file contains components useful to create a new credential

// Some global utilities
import React from 'react'; // React core
import CryptoJS from 'crypto-js'; // For encrypting credentials
import PropTypes from 'prop-types'; // For ensuring correct data passage

// Import Credential class definition from API
import Credential from '/imports/api/Credential';

// Error handler helper
import { handleError } from '/imports/ui/helpers';

// The CredentialNew component takes a single argument, `onSubmit`
// which is a function passed by the component representing the
// instance will take ownership of the newly-created credential.
// This is because all credentials are attached to another object
const CredentialNew = ({ onSubmit }) => (
	<form
		className="credential new"
		onSubmit={event => {
			// Prevent weirdness by preventing the default action
			// of the form's submission (which is usually a redirect)
			event.preventDefault();
			// Only proceed if the dash master key has been set
			if(localStorage.dashMasterKey) {
				// Create a new credential instance
				const credential = new Credential({
					url: $(event.target).find('[name=url]').val(), // URL is required
					user: $(event.target).find('[name=user]').val() || undefined, // User defaults to undefined
					// Encryppt the password with the master key
					password: CryptoJS.AES.encrypt($(event.target).find('[name=password]').val(), localStorage.dashMasterKey).toString()
				});
				// Send the newly-created credential to the server to be saved.
				// `/imports/api/Credential/methods.js`
				// because inserting from the client is not allowed for security
				Meteor.call('/credentials/create', credential, (error, credentialId) => {
					handleError(error).then(() => {
						// If there is no error, execute the function passed
						// as the `onSubmit` prop
						onSubmit(credentialId);
					});
				});
			}
		}}
		>
		<input required type="text" name="url" placeholder="url" />
		<input type="text" name="user" placeholder="user" />
		<input required type="text" name="password" placeholder="secret" />
		<input type="submit" value="Add credential" />
	</form>
);

// Make sure that onSubmit is a function
CredentialNew.propTypes = {
	onSubmit: PropTypes.func
};

// If onSubmit is not passed, just prevent
// the form from being submitted
CredentialNew.defaultProps = {
	onSubmit: event => event.preventDefault()
};

// This file exports only the above component
export default CredentialNew;
