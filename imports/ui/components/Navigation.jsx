import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import container from '/imports/ui/modules/container';

class Navigation extends React.Component {
	render () {
		const hasUser = this.props.hasUser;
		return hasUser ? (
			<ul>
				<li><Link to="/">Home</Link></li>
				<li><Link to="/clients">Clients</Link></li>
				<li><Link to="/clients/new">New Client</Link></li>
				<li><Link to="/login" onClick={event => {Meteor.logout()}}>Sign Out</Link></li>
			</ul>
		) : null;
	}
}

export default container((props, onData) => {
	onData(null, {hasUser: Meteor.user()});
}, Navigation);
