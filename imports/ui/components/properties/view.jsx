import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '/imports/api/properties';
import container from '/imports/ui/modules/container';
import { handleError } from '/imports/ui/helpers';

class PropertyView extends React.Component {
	render() {
		const property = this.props.property;
		return (
			<div className="property property--view">
				<h1>{property.name}</h1>
				<Link to={property.client().url}>Property of {property.client().name}</Link>
			</div>
		);
	}
}

export default container(({match}, onData) => {
	const propertyId = match.params.propertyId;
	const subscription = Meteor.subscribe('/properties/view', propertyId);

	if(subscription.ready()) {
		const property = Property.findOne(propertyId);
		onData(null, {property, subscription});
	}
}, PropertyView);
