import React from 'react';
import { Accounts } from 'meteor/accounts-base';

import User from '/imports/api/User';

import { handleError } from '/imports/ui/helpers';

const UserNew = ({ history, onSubmit }) => (
	<form
		className="user user--new"
		onSubmit={event => {
			event.preventDefault();
			const user = {
				email: $(event.target).find('[name=email]').val(),
				password: $(event.target).find('[name=password]').val(),
				profile: {
					name: $(event.target).find('[name=name]').val()
				}
			};
			Accounts.createUser(user, error => handleError(error).then(() => {
				onSubmit();
			}));
		}}
		>
		<input type="text" name="name" placeholder="User Name"/>
		<input type="email" name="email" placeholder="User Email"/>
		<input type="text" name="password" placeholder="User Password"/>
		<input type="submit" value="Add"/>
	</form>
);

export default UserNew;
