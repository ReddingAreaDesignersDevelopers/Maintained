import React from 'react';
import { Credential } from '/imports/api/credentials';
import { handleError } from '/imports/ui/helpers';
import CryptoJS from 'crypto-js';

const CredentialNew = ({ onSubmit }) => (
	<form
		id="credentialNew"
		onSubmit={event => {
			event.preventDefault();
			if(localStorage.dashMasterKey) {
				const credential = new Credential({
					url: $(event.target).find('[name=url]').val(),
					user: $(event.target).find('[name=user]').val() || undefined,
					password: CryptoJs.AES.encrypt($(event.target).find('[name=password]').val(), localStorage.dashMasterKey).toString()
				});
				Meteor.call('/credentials/create', credential, (error, credentialId) => {
					handleError(error).then(() => {
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

export default CredentialNew;
