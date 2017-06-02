import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Service from '/imports/api/Service';

import container from '/imports/ui/modules/container';

const ServiceListItem = ({ service }) => (
	<li>
		<Link to={service.url}>{service.name}</Link>
	</li>
);

ServiceListItem.propTypes = {
	service: PropTypes.instanceOf(Service)
};

ServiceListItem.defaultProps = {
	service: new Service()
};

const ServiceList = ({ services }) => (
	<ul className="service">
		{services.map(service => <ServiceListItem service={service} key={service._id} />)}
		<li><Link to="/services/new"><button className="creater"><i className="mdi mdi-plus"></i><i className="mdi mdi-clipboard-account"></i></button></Link></li>
	</ul>
);

ServiceList.propTypes = {
	services: PropTypes.arrayOf(PropTypes.instanceOf(Service))
};

ServiceList.defaultProps = {
	services: []
};

export default container((props, onData) => {
	const subscription = Meteor.subscribe('/services/list');
	if(subscription.ready()) {
		const services = Service.find().fetch();
		onData(null, {services});
	}
}, ServiceList);
