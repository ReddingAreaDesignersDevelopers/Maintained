import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Property from '/imports/api/Property';

import container from '/imports/ui/modules/container';

const PropertyListItem = ({ property }) => (
	<li>
		<Link to={property.url}>{property.name}</Link>
	</li>
);

PropertyListItem.propTypes = {
	property: PropTypes.instanceOf(Property)
};

PropertyListItem.defaultProps = {
	property: new Property()
};

const PropertyList = ({ properties }) => (
	<ul className="property">
		{properties.map(property => <PropertyListItem property={property} key={property._id} />)}
		<li><Link to="/properties/new"><button className="creater"><i className="mdi mdi-plus"></i><i className="mdi mdi-book"></i></button></Link></li>
	</ul>
);

PropertyList.propTypes = {
	properties: PropTypes.arrayOf(PropTypes.instanceOf(Property))
};

export default container((props, onData) => {
	const subscription = Meteor.subscribe('/properties/list');
	if(subscription.ready()) {
		const properties = Property.find().fetch();
		onData(null, {properties});
	}
}, PropertyList);
