import { Meteor } from 'meteor/meteor';
import React from 'react';
import container from '/imports/ui/modules/container';
import { handleError } from '/imports/ui/helpers';

class CredentialView extends React.Component {
	render () {
		// We can assume this because we won't be passed a credential
		// outside of a context where it has already been subscribed to
		const credential = this.props.credential;
		return (
			<form
				className="credential credential--view"
				onSubmit={event => event.preventDefault()}
				>
				<input
					required
					type="text"
					name="url"
					placeholder="url"
					value={credential.url}
					onChange={
						event => {
							credential.url = event.target.value;
							Meteor.call('/credentials/save', credential, error => handleError(error));
						}
					}
				/>
				<input
					type="text"
					name="user"
					placeholder="user"
					value={credential.user}
					onChange={
						event => {
							credential.user = event.target.value;
							Meteor.call('/credentials/save', credential, error => handleError(error));
						}
					}
				/>
				<input
					required
					type="text"
					name="password"
					placeholder="secret"
					value={credential.password}
					onChange={
						event => {
							credential.password = event.target.value;
							Meteor.call('/credentials/save', credential, error => handleError(error));
						}
					}
				/>
				<input
					type="button"
					value="delete"
					onClick={event => this.props.onDelete(credential._id)}
				/>
			</form>
		)
	}
}

export default container((props, onData) => {
	onData(null, {});
}, CredentialView);
