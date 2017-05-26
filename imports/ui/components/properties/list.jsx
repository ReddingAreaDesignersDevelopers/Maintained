import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '/imports/api/properties';
import container from '/imports/ui/modules/container';

const PropertyListItem = ({ property }) => (
	<li>
		<Link to={property.url}>{property.name}</Link>
	</li>
);

const PropertyList = ({ properties }) => (
	<ul>
		{properties.map(property => <PropertyListItem property={property} key={property._id} />)}
		<li><Link to="/properties/new">New Property</Link></li>
	</ul>
);

export default container((props, onData) => {
	const subscription = Meteor.subscribe('/properties/list');
	if(subscription.ready()) {
		const properties = Property.find().fetch();
		onData(null, {properties});
	}
}, PropertyList);
