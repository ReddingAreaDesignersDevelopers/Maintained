import React from 'react';
// import { Link, BrowserRoute as Router, Switch, Route } from 'react-router-dom';
import { Client, Clients } from '/imports/api/clients/clients';
import container from '/imports/ui/modules/container';


class ClientView extends React.Component {
	render () {
		const client = this.props.client;
		return (
			<div className="client client--view" id="">
				<h1>{client.name}</h1>
			</div>
		);
	}
};

export default container(({match}, onData) => {
	const clientId = match.params.clientId;
	const subscription = Meteor.subscribe('/clients/view', clientId);

	if(subscription.ready()) {
		const client = Client.findOne(clientId);
		onData(null, {client});
	}
}, ClientView);
