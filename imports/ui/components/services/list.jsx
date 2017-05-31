import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '/imports/api/services';
import container from '/imports/ui/modules/container';

const ServiceListItem = ({ service }) => (
	<li>
		<Link to={service.url}>{service.name}</Link>
	</li>
);

const ServiceList = ({ services }) => (
	<ul className="list list__services">
		{services.map(service => <ServiceListItem service={service} key={service._id} />)}
		<li><Link to="/services/new"><button className="creater"><i className="mdi mdi-plus"></i><i className="mdi mdi-clipboard-account"></i></button></Link></li>
	</ul>
);

export default container((props, onData) => {
	const subscription = Meteor.subscribe('/services/list');
	if(subscription.ready()) {
		const services = Service.find().fetch();
		onData(null, {services});
	}
}, ServiceList);
