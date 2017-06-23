// This file is for defining how a client should appear when
// rendered to the screen. All changes made should be immediately saved
// in keeping with the principles of the project.
// There should be a field for editing & updating every field defined
// in the Client class at `/imports/api/Client/index.js`

// Import some globally-useful objects
import React from 'react'; // React core
import { Link } from 'react-router-dom'; // For linking
import PropTypes from 'prop-types'; // For checking proper data passage

// Import the CLient class definition from the API
import Client from '/imports/api/Client';

// Import some sub-components
import CredentialList from '/imports/ui/components/Credential/List'; // Listing client credentials
import PersonList from '/imports/ui/components/Person/List'; // Listing people associated
import { PhysicalAddressList } from '/imports/ui/components/helpers/physicalAddress'; // Listing
import { EmailAddressList } from '/imports/ui/components/helpers/emailAddress';
import { PhoneNumberList } from '/imports/ui/components/helpers/phoneNumber';

// Import some helpers
import container from '/imports/ui/modules/container';
import { handleError, Renamer, DashIcon } from '/imports/ui/helpers';

// The ClientView component
class ClientView extends React.Component {

	// Make sure that the data is passed proberly
	static propTypes = {
		client: PropTypes.instanceOf(Client), // The client prop should be a Client instance
		subscription: PropTypes.object // The subscription is a generic object
	}

	// Just in case something isn't passed, some placeholders
	static defaultProps = {
		client: new Client(), // A blank Client instance
		subscription: {}
	}

	// HACK A little song and dance because the container doesn't quite stay reactive
	resubscribe (component) {
		component.props.subscription.stop();
		component.props.subscription = Meteor.subscribe('/clients/view', component.props.client._id);
	}

	render () {
		const client = this.props.client; // Pure convenience
		return (
			<div className="client view" id={`client-${client._id}`}>
				<h1>
					{/* See /imports/ui/helpers */}
					<Renamer
						object={client}
						onSubmit={client => Meteor.call('/clients/save', client, error => handleError(error))}
					/>
				</h1>
				<div className="credentials card">
					<h2><DashIcon of="credential" />Credentials</h2>
					<CredentialList
						credentials={client.credentials().fetch()}
						onAdd={credentialId => client.callMethod('addCredential', credentialId, error => handleError(error).then(() => {this.resubscribe(this)}))}
						onDelete={credentialId => client.callMethod('removeCredential', credentialId, handleError)}
					/>
				</div>
				<div className="physical-address card">
					<h2><DashIcon of="physicalAddress" />Physical Addresses</h2>
					<PhysicalAddressList
						physicalAddresses={client.uniquePhysicalAddresses}
						onAdd={physicalAddress => client.callMethod('addPhysicalAddress', physicalAddress, handleError)}
						onUpdate={(physicalAddress, index) => client.callMethod('updatePhysicalAddress', physicalAddress, index, handleError)}
						onDelete={index => client.callMethod('removePhysicalAddress', index, handleError)}
					/>
				</div>
				<div className="email-address card">
					<h2><DashIcon of="emailAddress" />Email Addresses</h2>
					<EmailAddressList
						emailAddresses={client.uniqueEmailAddresses}
						onAdd={emailAddress => client.callMethod('addEmailAddress', emailAddress, handleError)}
						onUpdate={(emailAddress, index) => client.callMethod('updateEmailAddress', emailAddress, index, handleError)}
						onDelete={index => client.callMethod('removeEmailAddress', index, handleError)}
					/>
				</div>
				<div className="phone-number card">
					<h2><DashIcon of="phoneNumber" />Phone Numbers</h2>
					<PhoneNumberList
						phoneNumbers={client.uniquePhoneNumbers}
						onAdd={phoneNumber => client.callMethod('addPhoneNumber', phoneNumber, handleError)}
						onUpdate={(phoneNumber, index) => client.callMethod('updatePhoneNumber', phoneNumber, index, handleError)}
						onDelete={index => client.callMethod('removePhoneNumber', index, handleError)}
					/>
				</div>
				<div className="person card">
					<h2><DashIcon of="person" />People</h2>
					<PersonList
						persons={client.persons().fetch()}
						roleAt={client}
					/>
				</div>
				<input
					name="referral"
					placeholder="referral"
					type="text"
					defaultValue={client.referral}
					onChange={event => {
						client.referral = event.target.value;
						Meteor.call('/clients/save', client, handleError);
					}}
				/>
				<div className="property card">
					<h2>Properties</h2>
					<ul className="client-property">{client.properties().map(property => <li key={property._id}><Link to={property.url}>{property.name}</Link></li>)}</ul>
				</div>
				<button className="remover" onClick={event => {
					Meteor.call('/clients/delete', client, error => {
						handleError(error).then(() => {
							this.props.history.push('/clients');
						});
					});
				}}>Remove Client</button>
			</div>
		);
	}
};

export default container(({match}, onData) => {
	const clientId = match.params.clientId;
	const subscription = Meteor.subscribe('/clients/view', clientId);

	if(subscription.ready()) {
		const client = Client.findOne(clientId);
		onData(null, {client, subscription});
	}
}, ClientView);
