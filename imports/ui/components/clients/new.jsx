import React from 'react';
import { Link, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Client, Clients } from '/imports/api/clients/clients';

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
					if(error) {
						console.error(error);
						Bert.alert({
							title: error.message,
							type: 'danger'
						});
					} else {
						this.props.history.push(`/clients/${clientId}`);
					}
				});
			}}>
			<input type="text" name="name" placeholder="Client Name" />
			<input type="submit" value="Save" />
		</form>
		);
	}
};

export default ClientNew;
