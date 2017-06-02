import React from 'react';
import CryptoJS from 'crypto-js';
import PropTypes from 'prop-types';

import Credential from '/imports/api/Credential';

import { handleError } from '/imports/ui/helpers';

const CredentialNew = ({ onSubmit }) => (
	<form
		className="credential new"
		onSubmit={event => {
			event.preventDefault();
			if(localStorage.dashMasterKey) {
				const credential = new Credential({
					url: $(event.target).find('[name=url]').val(),
					user: $(event.target).find('[name=user]').val() || undefined,
					password: CryptoJS.AES.encrypt($(event.target).find('[name=password]').val(), localStorage.dashMasterKey).toString()
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

CredentialNew.propTypes = {
	onSubmit: PropTypes.func
};

CredentialNew.defaultProps = {
	onSubmit: event => event.preventDefault()
};

export default CredentialNew;
