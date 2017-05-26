import React from 'react';
import { Meteor } from 'meteor/meteor';
import { CredentialType } from '/imports/api/credentials';
import { handleError } from '/imports/ui/helpers';

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
			type="text"
			name="password"
			placeholder="secret"
			defaultValue={credential.password}
			onChange={event => {
				credential.password = event.target.value;
				Meteor.call('/credentials/save', credential, handleError);
			}}
		/>
		<select
			name="credentialType"
			defaultValue={credential.credentialType}
			onChange={event => {
				credential.credentialType = Number(event.target.value);
				Meteor.call('/credentials/save', credential, handleError);
			}}
			>
				{credentialTypes.map(credentialType => <option key={credentialType.index} value={credentialType.index}>{credentialType.name}</option>)}
		</select>
		<input
			type="button"
			value="delete"
			onClick={event => onDelete(credential._id)}
		/>
	</form>
);

export default CredentialView;
