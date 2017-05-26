import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Property } from '/imports/api/properties';
import { Client } from '/imports/api/clients';
import { handleError, TypeaheadResults } from '/imports/ui/helpers';
import container from '/imports/ui/modules/container';

class PropertyNew extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			clientMatches: [],
			clientSelected: false
		}
	}

	render () {
		return (
			<form
				id="propertyNew"
				onSubmit={event => {
					event.preventDefault();
					const name = $(event.target).find('[name=name]').val();
					const clientId = $(event.target).find('[name=clientId]').val();
					const property = new Property({
						name: name ? name : undefined,
						clientId: clientId ? clientId : undefined
					});
					Meteor.call('/properties/create', property, (error, propertyId) => {
						handleError(error).then(() => {
							this.props.history.push(`/properties/${propertyId}`);
						});
					});
				}}>
					<label htmlFor="name">
						Property Name
						<input type="text" required name="name" placeholder="Name"/>
					</label>
					<label htmlFor="client">
						Client
						<input type="text" required name="client" placeholder="Name"  onKeyUp={event => {
							const maxResults = 5;
							this.setState({clientSelected: false});
							const clientMatches = _.first(_.filter(Client.find().fetch(), client => {
								return client.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0;
							}), maxResults);
							this.setState({clientMatches});
						}}/>
						{this.state.clientSelected
							? ''
							: <TypeaheadResults results={this.state.clientMatches} onSelect={clientId => {
									this.setState({clientSelected: true});
									const client = Client.findOne(clientId);
									$('[name=clientId]').val(clientId);
									$('[name=client]').val(client.name);
								}} />
						}
						<input type="hidden" required name="clientId"/>
					</label>
					<input type="submit" value="Save"/>
			</form>
		);
	}
}

export default container((props, onData) => {
	const subscription = Meteor.subscribe('/clients/list');
	if(subscription.ready()) {
		onData(null, {});
	}
}, PropertyNew);
