import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Service } from '/imports/api/services';
import container from '/imports/ui/modules/container';
import { handleError, Renamer } from '/imports/ui/helpers';
import { PropertyList } from '/imports/ui/components/properties';

class ServiceView extends React.Component {
	render () {
		const service = this.props.service;
		console.log(service);
		return (
			<div className="service service--view">
				<h1>
					<Renamer
						object={service}
						onSubmit={service => Meteor.call('/services/save', service, error => handleError(error))}
					/>
				</h1>
				<h2>Properties using this service</h2>
				<ul className="list list__properties">
					{service.properties().fetch().map((property, index) => <li key={property._id}><a href={property.url}>{property.name}</a></li>)}
				</ul>
			</div>
		)
	}
}

export default container(({match}, onData) => {
	const serviceId = match.params.serviceId;
	const subscription = Meteor.subscribe('/services/view', serviceId);

	if(subscription.ready()) {
		const service = Service.findOne(serviceId);
		onData(null, {service, subscription});
	}
}, ServiceView);
