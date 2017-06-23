// Import some globally-useful objects
import React from 'react'; // React core
import PropTypes from 'prop-types'; // Library for checking proper data is passed

// Imports the Client class definition from the API
import Client from '/imports/api/Client';

// Imports a helper in case there is an error
// upon adding a new client
import { handleError } from '/imports/ui/helpers';

// ClientNew is a component for creating new clients.
// A purely-functional component that should only
// have to interact with the app history so as to
// redirect upon creation
const ClientNew = ({ history }) => (
	<form
		className="client new"
		onSubmit={event => {
			// preventDefault so nothing redirects
			event.preventDefault();
			// Create a new client as named
			const client = new Client({
				name: $(event.target).find('[name=name]').val()
			});
			// Call the meteor method in `/imports/api/Client/methods.js`
			// which creates a new ciient (inserting from the front-end is
			// not allowed)
			Meteor.call('/clients/create', client, (error, clientId) => {
				// If there's an error, deal with it, then
				// navigate to the newly-created client's URL
				handleError(error).then(() => {
					history.push(`/clients/${clientId}`);
				});
			});
		}}>
		<input type="text" name="name" placeholder="Client Name" />
		<input type="submit" value="Save" />
	</form>
);

// This file exports a single component, ClientNew
export default ClientNew;
