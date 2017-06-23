// This file is loaded to display a credential, whether
// it is embedded in a client, site, or other

// Some global utilities
import { Meteor } from 'meteor/meteor'; // Meteor core
import React from 'react'; // React core
import { Bert } from 'meteor/themeteorchef:bert'; // Notifications system
import CryptoJS from 'crypto-js'; // For en/de/crypting
import PropTypes from 'prop-types'; // For ensuring proper data passage

// Import Credential class definition and utility from API
import Credential, { CredentialType } from '/imports/api/Credential';

// ui helpers
import { handleError, Select } from '/imports/ui/helpers';
import PlaintextSVG from '/imports/ui/svg/plaintext.svg.jsx'; // Icon for copying credential

// HACK Loop through the types of credentials to get the identifiers
// Kind of hacky, but Astro.Enum doesn't provide a way
// to get non-consecutive indecies.
// Read http://jagi.github.io/meteor-astronomy/#enum-type for more
const credentialTypes = []; // A utility array for this file only
for(prop in CredentialType) {
	if(
		CredentialType.hasOwnProperty(prop)
		&& ['getIdentifiers', 'getIdentifier'].indexOf(prop) < 0 // Don't get the special functions
	) {
		credentialTypes.push({
			name: prop.toLowerCase(),
			index: CredentialType[prop]
		});
	}
}

// The component for viewing a credential. Takes two props:
// The credential instance, and a function to be executed when
// the credential is deleted.
const CredentialView = ({ credential, onDelete }) => (
	<form
		className="credential credential--view"
		onSubmit={event => event.preventDefault()}
		>
		<PlaintextSVG onClick={event => {
			// When the icon to copy the credential is clicked,
			// decrypt the password,
			const password = CryptoJS.AES.decrypt(credential.password, localStorage.dashMasterKey).toString(CryptoJS.enc.Utf8);
			// Create the text to be copied
			const textToCopy = `URL: ${credential.url}\r\nUser: ${credential.user}\r\nPassword: ${password}`;
			// Create a textarea from which to copy the text
			const temporaryTextarea = document.createElement('textarea');
			// Append that textarea
			$(event.target).parent('.credential').append(temporaryTextarea);
			// Set the value of that textarea to the text to be copied
			temporaryTextarea.value = temporaryTextarea.innerHTML = textToCopy;
			// If the browser can copy, do that
			try {
				temporaryTextarea.select();
				document.execCommand('copy');
				// And tell the user
				Bert.alert(`Credential for ${credential.url} copied`, 'success');
			} catch (error) {
				// Otherwise, alert with the text so the user can copy it
				// themselves
				alert(textToCopy);
			}
			// Then remove the temporary textarea
			temporaryTextarea.remove();
		}} />
		<input
			required
			type="text"
			name="url"
			placeholder="url"
			defaultValue={credential.url}
			onClick={event => event.target.select()}
			onChange={event => {
				credential.url = event.target.value;
				Meteor.call('/credentials/save', credential, handleError); // Send updated credential to server
			}}
		/>
		<input
			type="text"
			name="user"
			placeholder="user"
			defaultValue={credential.user}
			onClick={event => event.target.select()}
			onChange={event => {
				credential.user = event.target.value;
				Meteor.call('/credentials/save', credential, handleError); // Send updated credential to server
			}}
		/>
		<input
			required
			type="password"
			onMouseEnter={event => {
				// When hovering the password, decrypt and display it
				const decrypted = CryptoJS.AES.decrypt(credential.password, localStorage.dashMasterKey).toString(CryptoJS.enc.Utf8);
				if(decrypted) {
					event.target.value = decrypted;
					// Displaying is handled by changing the input type to text
					event.target.type = 'text';
				}
			}}
			onMouseLeave={event => {
				// When the mouse leaves the input, turn it back to its hidden/encrypted state
				event.target.value = credential.password;
				event.target.type = 'password';
			}}
			name="password"
			placeholder="secret"
			defaultValue={credential.password}
			onClick={event => event.target.select()}
			onChange={event => {
				// When changing the password, encrypt it client-side
				if(event.target.type === 'text') {
					credential.password = CryptoJS.AES.encrypt(event.target.value, localStorage.dashMasterKey).toString();
					Meteor.call('/credentials/save', credential, handleError); // Send updated credential to server
				}
			}}
		/>
		<Select
			name="credentialType"
			value={credential.credentialType}
			clearable={false}
			options={credentialTypes.map(credentialType => Object({
				value: credentialType.index,
				label: credentialType.name}
			))}
			onChange={selectedOption => {
				credential.credentialType = Number(selectedOption.value);
				Meteor.call('/credentials/save', credential, handleError);
			}}
			/>
		<button className="remover" onClick={event => onDelete(credential._id)}><i className="mdi mdi-delete"></i></button>
	</form>
);

// Make sure only a credential instance and a function are
// passed to the component
CredentialView.propTypes = {
	credential: PropTypes.instanceOf(Credential),
	onDelete: PropTypes.func
};

// If data is not passed, default to a blank credential
// and a blank function
CredentialView.defaultProps = {
	credential: new Credential(),
	onDelete: () => {}
};

// This file exports only the above component
export default CredentialView;
