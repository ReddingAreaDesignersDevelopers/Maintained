import React from 'react';
import { Credential } from '/imports/api/credentials';
import { handleError } from '/imports/ui/helpers';

class CredentialNew extends React.Component {
	render () {
		return (
			<form
				id="credentialNew"
				onSubmit={event => {
					event.preventDefault();
					const credential = new Credential({
						url: $(event.target).find('[name=url]').val(),
						user: $(event.target).find('[name=user]').val() || undefined,
						password: $(event.target).find('[name=password]').val()
					});
					Meteor.call('/credentials/save', credential, (error, credentialId) => {
						handleError(error).then(() => {
							this.props.onSubmit(credentialId);
						});
					});
				}}
				>
				<input required type="text" name="url" placeholder="url" />
				<input type="text" name="user" placeholder="user" />
				<input required type="text" name="password" placeholder="secret" />
				<input type="submit" value="Add credential" />
			</form>
		);
	}
}

export default CredentialNew;
