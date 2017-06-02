import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Client from '/imports/api/Client';

import container from '/imports/ui/modules/container';

export const ClientListItem = ({ client }) => (
	<li>
		<Link to={client.url}>{client.name}</Link>
	</li>
);

ClientListItem.propTypes = {
	client: PropTypes.instanceOf(Client)
};

ClientListItem.defaultProps = {
	client: new Client()
};

const ClientList = ({ clients }) => (
	<ul className="client">
		{clients.map(client => <ClientListItem client={client} key={client._id} />)}
		<li><Link to="/clients/new"><button className="creater"><i className="mdi mdi-plus"></i><i className="mdi mdi-account"></i></button></Link></li>
	</ul>
);

ClientList.propTypes = {
	clients: PropTypes.arrayOf(PropTypes.instanceOf(Client))
};

ClientList.defaultProps = {
	clients: []
};


export default container(({match}, onData) => {
	// Get the data from the server before showing anything
	const subscription = Meteor.subscribe('/clients/list');
	if(subscription.ready()) {
		const clients = Client.find().fetch();
		onData(null, {clients});
	}
}, ClientList);
