import React from 'react';
import { Link } from 'react-router-dom';
import { Client } from '/imports/api/clients';
import container from '/imports/ui/modules/container';

const ClientListItem = ({ client }) => (
	<li>
		<Link to={client.url}>{client.name}</Link>
	</li>
)

const ClientList = () => (
	<ul>
		{Client.find().fetch().map(client => <ClientListItem client={client} key={client._id} />)}
	</ul>
)


export default container(({match}, onData) => {
	// Get the data from the server before showing anything
	const subscription = Meteor.subscribe('/clients/list');
	if(subscription.ready()) {
		onData(null, {});
	}
}, ClientList);
