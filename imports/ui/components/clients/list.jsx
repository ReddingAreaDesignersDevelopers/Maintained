import React from 'react';
import { Link } from 'react-router-dom';
import { Client, Clients } from '/imports/api/clients/clients';
import container from '/imports/ui/modules/container';

class ClientListItem extends React.Component {
	render () {
		const client = this.props.client;
		return (
			<li>
				<Link to={client.url}>{client.name}</Link>
			</li>
		)
	}
}

class ClientList extends React.Component {
	render () {
		const rows = [];
		Client.find().forEach(client => {
			rows.push(<ClientListItem client={client} key={client._id}/>);
		});
		return <ul>{rows}</ul>;
	}
}

export default container(({match}, onData) => {
	const subscription = Meteor.subscribe('/clients/list');
	if(subscription.ready()) {
		onData(null, {});
	}
}, ClientList);
