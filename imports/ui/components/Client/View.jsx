import React from 'react';
import { Link } from 'react-router-dom';

import Client from '/imports/api/Client';

import CredentialList from '/imports/ui/components/Credential/List';
import PersonList from '/imports/ui/components/Person/List';
import { PhysicalAddressList } from '/imports/ui/components/helpers/physicalAddress';
import { EmailAddressList } from '/imports/ui/components/helpers/emailAddress';
import { PhoneNumberList } from '/imports/ui/components/helpers/phoneNumber';

import container from '/imports/ui/modules/container';
import { handleError, Renamer } from '/imports/ui/helpers';

class ClientView extends React.Component {

	resubscribe (component) {
		// A little song and dance because the container doesn't quite stay reactive
		component.props.subscription.stop();
		component.props.subscription = Meteor.subscribe('/clients/view', component.props.client._id);
	}

	render () {
		const client = this.props.client;
		return (
			<div className="client view" id={`client-${client._id}`}>
				<h1>
					<Renamer
						object={client}
						onSubmit={client => Meteor.call('/clients/save', client, error => handleError(error))}
					/>
				</h1>
				<div className="credentials card">
					<h2><i className="mdi mdi-key"></i>Credentials</h2>
					<CredentialList
						credentials={client.credentials().fetch()}
						onAdd={credentialId => client.callMethod('addCredential', credentialId, error => handleError(error).then(() => {this.resubscribe(this)}))}
						onDelete={credentialId => client.callMethod('removeCredential', credentialId, handleError)}
					/>
				</div>
				<div className="physical-address card">
					<h2><i className="mdi mdi-map-marker"></i>Physical Addresses</h2>
					<PhysicalAddressList
						physicalAddresses={client.uniquePhysicalAddresses}
						onAdd={physicalAddress => client.callMethod('addPhysicalAddress', physicalAddress, handleError)}
						onUpdate={(physicalAddress, index) => client.callMethod('updatePhysicalAddress', physicalAddress, index, handleError)}
						onDelete={index => client.callMethod('removePhysicalAddress', index, handleError)}
					/>
				</div>
				<div className="email-address card">
					<h2><i className="mdi mdi-email"></i>Email Addresses</h2>
					<EmailAddressList
						emailAddresses={client.uniqueEmailAddresses}
						onAdd={emailAddress => client.callMethod('addEmailAddress', emailAddress, handleError)}
						onUpdate={(emailAddress, index) => client.callMethod('updateEmailAddress', emailAddress, index, handleError)}
						onDelete={index => client.callMethod('removeEmailAddress', index, handleError)}
					/>
				</div>
				<div className="phone-number card">
					<h2><i className="mdi mdi-phone"></i>Phone Numbers</h2>
					<PhoneNumberList
						phoneNumbers={client.uniquePhoneNumbers}
						onAdd={phoneNumber => client.callMethod('addPhoneNumber', phoneNumber, handleError)}
						onUpdate={(phoneNumber, index) => client.callMethod('updatePhoneNumber', phoneNumber, index, handleError)}
						onDelete={index => client.callMethod('removePhoneNumber', index, handleError)}
					/>
				</div>
				<div className="person card">
					<h2><i className="mdi mdi-account-multiple"></i>People at Client</h2>
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
				<button onClick={event => {
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
