import React from 'react';

import Client from '/imports/api/Client';

import { handleError } from '/imports/ui/helpers';

const ClientNew = ({ history }) => (
	<form
		className="client new"
		onSubmit={event => {
			event.preventDefault();
			const client = new Client({
				name: $(event.target).find('[name=name]').val()
			});
			Meteor.call('/clients/create', client, (error, clientId) => {
				handleError(error).then(() => {
					history.push(`/clients/${clientId}`);
				});
			});
		}}>
		<input type="text" name="name" placeholder="Client Name" />
		<input type="submit" value="Save" />
	</form>
);

export default ClientNew;
