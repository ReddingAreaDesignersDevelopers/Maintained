import React from 'react';
import { Meteor } from 'meteor/meteor';
import { CredentialType } from '/imports/api/credentials';
import { handleError, Select } from '/imports/ui/helpers';

const credentialTypes = [];
for(prop in CredentialType) {
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
		<input
			required
			type="text"
			name="url"
			placeholder="url"
			defaultValue={credential.url}
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
			onChange={event => {
				credential.user = event.target.value;
				Meteor.call('/credentials/save', credential, handleError);
			}}
		/>
		<input
			required
			type="password"
			onMouseEnter={event => {
				event.target.type = 'text';
			}}
			onMouseLeave={event => {
				event.target.type = 'password';
			}}
			name="password"
			placeholder="secret"
			defaultValue={credential.password}
			onChange={event => {
				credential.password = event.target.value;
				Meteor.call('/credentials/save', credential, handleError);
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
