// Import some globally-useful objects
import React from 'react'; // React core
import PropTypes from 'prop-types'; // For checking that proper data are passed to components
import { Link } from 'react-router-dom'; // For linking

// Importing Client class definition from API
import Client from '/imports/api/Client';

// Importing container for properly composing data
import container from '/imports/ui/modules/container';

// ClientListItem is a utility component that displays a link to
// the client which is passed via prop.
// A purely-functional component
export const ClientListItem = ({ client }) => (
	<li>
		<Link to={client.url}>{client.name}</Link>
	</li>
);

// Let's do some type checking to make sure
// only an instance of a client is passed to the
// list item
ClientListItem.propTypes = {
	client: PropTypes.instanceOf(Client)
};

// If nothing is passed, use a blank client as
// a placeholder
ClientListItem.defaultProps = {
	client: new Client()
};

// ClientList takes a list of clients and renders them
// A purely-functional component
const ClientList = ({ clients }) => (
	<ul className="client">
		{clients.map(client => <ClientListItem client={client} key={client._id} />)}
		{/* Also displays a link to create a new client */}
		<li><Link to="/clients/new"><button className="creater"><i className="mdi mdi-plus"></i><i className="mdi mdi-account"></i></button></Link></li>
	</ul>
);

// More type checking - ClientList should only receive
// an array of Client instances
ClientList.propTypes = {
	clients: PropTypes.arrayOf(PropTypes.instanceOf(Client))
};


// If passed nothing, just render with a blank array, which
// will show only the "create new client" button
ClientList.defaultProps = {
	clients: []
};


// This container wraps the component in a function that first makes sure
// that the data which it needs is available before it is rendered
export default container(({match}, onData) => {
	// Get the data from the server before showing anything
	// TODO Allow the component to accept an arbitrary list, not just all clients
	const subscription = Meteor.subscribe('/clients/list'); // Subscribe to all clients
	if(subscription.ready()) {
		const clients = Client.find().fetch(); // Get all clients
		onData(null, {clients}); // Pass all clients to the CLientList component
	}
}, ClientList);
