import { Meteor } from 'meteor/meteor';
import React from 'react';
import CryptoJS from 'crypto-js';

class FirstTimeKey extends React.Component {
	render () {
		return Meteor.user()
			? <div className="firstTimeKey">
				<h1>Dash Key</h1>
				<p>This appears to be your first time using the dash. In order to encrypt credentials, the system needs to generate and store a key on your computer that will be used to encrypt sensitive information. This key may be added to other computers but never reaches the server.</p>
				<form
					onSubmit={event => {
						event.preventDefault();
						const salt = $(event.target).find('[name=salt]').val();
						const key = CryptoJS.AES.encrypt(salt, salt).toString();
						localStorage.dashMasterKey = key;
						this.props.history.push('/');
					}}
					>
					<input type="text" name="salt" required/>
					<input type="submit" value="Generate key" />
				</form>
			</div>
			: null;
	}
}

export default FirstTimeKey;
