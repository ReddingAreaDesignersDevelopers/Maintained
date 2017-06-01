import React from 'react';
import { Meteor } from 'meteor/meteor';
import { CredentialType } from '/imports/api/credentials';
import { handleError, Select } from '/imports/ui/helpers';
import PlaintextSVG from '/imports/ui/svg/plaintext.svg.jsx';
import { Bert } from 'meteor/themeteorchef:bert';

import CryptoJS from 'crypto-js';

const credentialTypes = [];
for(prop in CredentialType) {
	console.log('crypto', CryptoJS);
	// Loop through the types of credentials to get the identifiers
	// Kind of hacky, but Astro.Enum doesn't provide a way
	// to get non-consecutive indecies
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

const CredentialView = ({ credential, onDelete }) => (
	<form
		className="credential credential--view"
		onSubmit={event => event.preventDefault()}
		>
		<PlaintextSVG onClick={event => {
			const password = CryptoJS.AES.decrypt(credential.password, localStorage.dashMasterKey).toString(CryptoJS.enc.Utf8);
			const textToCopy = `URL: ${credential.url}\r\nUser: ${credential.user}\r\nPassword: ${password}`;
			const temporaryTextarea = document.createElement('textarea');
			$(event.target).parent('.credential').append(temporaryTextarea);
			temporaryTextarea.value = temporaryTextarea.innerHTML = textToCopy;
			try {
				temporaryTextarea.select();
				document.execCommand('copy');
				Bert.alert(`Credential for ${credential.url} copied`, 'success');
			} catch (error) {
				alert(textToCopy);
			}
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
				Meteor.call('/credentials/save', credential, handleError);
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
				Meteor.call('/credentials/save', credential, handleError);
			}}
		/>
		<input
			required
			type="password"
			onMouseEnter={event => {
				const decrypted = CryptoJS.AES.decrypt(credential.password, localStorage.dashMasterKey).toString(CryptoJS.enc.Utf8);
				console.log('dec', decrypted);
				if(decrypted) {
					event.target.value = decrypted;
					event.target.type = 'text';
				}
			}}
			onMouseLeave={event => {
				event.target.value = credential.password;
				event.target.type = 'password';
			}}
			name="password"
			placeholder="secret"
			defaultValue={credential.password}
			onClick={event => event.target.select()}
			onChange={event => {
				if(event.target.type === 'text') {
					credential.password = CryptoJS.AES.encrypt(event.target.value, localStorage.dashMasterKey).toString();
					Meteor.call('/credentials/save', credential, handleError);
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

export default CredentialView;
