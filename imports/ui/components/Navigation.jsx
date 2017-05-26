import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import container from '/imports/ui/modules/container';
import { handleError } from '/imports/ui/helpers';

class Navigation extends React.Component {
	logout (clickEvent) {
		clickEvent.preventDefault();
		Meteor.logout(error => {
			handleError(error).then(() => {
				window.location = '/login';
			});
		});
	}
	render () {
		const hasUser = this.props.hasUser;
		return hasUser ? (
			<ul className="navigation navigation__main">
				<li><Link to="/">Home</Link></li>
				<li><Link to="/clients">Clients</Link></li>
				<li><Link to="/properties">Properties</Link></li>
				<li><Link to="/login" onClick={this.logout}>Sign Out</Link></li>
			</ul>
		) : null;
	}
}

export default container((props, onData) => {
	onData(null, {hasUser: Meteor.user()});
}, Navigation);
