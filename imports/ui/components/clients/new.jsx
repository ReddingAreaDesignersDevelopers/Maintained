import React from 'react';
import { Link, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Client } from '/imports/api/clients';
import { handleError } from '/imports/ui/helpers';

class ClientNew extends React.Component {
	render () {
		return (
		<form
			id="clientNew"
			onSubmit={event => {
				event.preventDefault();
				const client = new Client({
					name: $(event.target).find('[name=name]').val()
				});
				Meteor.call('/clients/save', client, (error, clientId) => {
					handleError(error).then(() => {
						this.props.history.push(`/clients/${clientId}`);
					});
				});
			}}>
			<input type="text" name="name" placeholder="Client Name" />
			<input type="submit" value="Save" />
		</form>
		);
	}
};

export default ClientNew;
