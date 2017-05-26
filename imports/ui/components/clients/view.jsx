import React from 'react';
// import { Link, BrowserRoute as Router, Switch, Route } from 'react-router-dom';
import { Client } from '/imports/api/clients';
import { Credential } from '/imports/api/credentials';
import CredentialView from '/imports/ui/components/credentials/view';
import CredentialNew from '/imports/ui/components/credentials/new';
import container from '/imports/ui/modules/container';
import { handleError } from '/imports/ui/helpers';
import { PhysicalAddressNew, PhysicalAddressView } from '/imports/ui/modules/physicalAddress';
import { createContainer } from 'meteor/react-meteor-data';

class ClientView extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			isAddingCredential: false
		};
	}

	addCredential (client, credentialId) {
		client.credentialIds.push(credentialId);
		Meteor.call('/clients/save', client, error => {
			handleError(error).then(() => {
				this.setState({isAddingCredential: false});
				Meteor.subscribe('/clients/view', client._id);
			});
		});
	}

	addPhysicalAddress (client, physicalAddress) {
		client.physicalAddresses.push(physicalAddress);
		Meteor.call('/clients/save', client, error => {
			handleError(error).then(() => {
				this.setState({isAddingPhysicalAddress: false});
				Meteor.subscribe('/clients/view', client._id);
			});
		});
	}

	render () {
		console.log('client view', this);
		const client = this.props.client;

		const credentials = [];
		client.credentials().forEach(credential => {
			credentials.push(
				<CredentialView
					credential={credential}
					key={credential._id}
					onDelete={credentialId => {
						client.callMethod('removeCredential', credentialId, error => {
							handleError(error).then(() => {
								Meteor.subscribe('/clients/view', client._id);
							});
						});
					}}
				/>
			);
		});

		const physicalAddresses = [];
		client.physicalAddresses.forEach((physicalAddress, index) => {
			physicalAddresses.push(
				<PhysicalAddressView
					physicalAddress={physicalAddress}
					key={index}
					index={index}
					onDelete={index => {
						client.callMethod('removePhysicalAddress', index, error => {
							handleError(error).then(() => {
								Meteor.subscribe('/clients/view', client._id);
							});
						});
					}}
				/>
			);
		});

		return (
			<div className="client client--view" id="">
				<h1>{client.name}</h1>
				<div className="list list__credentials">
					{credentials}
					{
						this.state.isAddingCredential
						? <CredentialNew onSubmit={credentialId => this.addCredential(client, credentialId)} />
						: <button onClick={event => this.setState({isAddingCredential: true})}>New Credential</button>
					}
				</div>
				<div className="list list__physicalAddresses">
					{physicalAddresses}
					{
						this.state.isAddingPhysicalAddress
						? <PhysicalAddressNew onSubmit={physicalAddress => this.addPhysicalAddress(client, physicalAddress)} />
						: <button onClick={event => this.setState({isAddingPhysicalAddress: true})}>New Address</button>
					}
				</div>
				<button onClick={
					event => {
						Meteor.call('/clients/delete', client, error => {
							handleError(error).then(() => {
								this.props.history.push('/clients');
							});
						});
					}
				}>Remove Client</button>
			</div>
		);
	}
};

export default createContainer(({match}) => {
	const clientId = match.params.clientId;
	const subscription = Meteor.subscribe('/clients/view', clientId);
	const loading = !subscription.ready();
	const client = Client.findOne(clientId);
	return {
		loading,
		subscription,
		client: client ? client : new Client()
	};
}, ClientView);

// export default container(({match}, onData) => {
// 	const clientId = match.params.clientId;
// 	const subscription = Meteor.subscribe('/clients/view', clientId);
//
// 	if(subscription.ready()) {
// 		const client = Client.findOne(clientId);
// 		onData(null, {client});
// 	}
// }, ClientView);
