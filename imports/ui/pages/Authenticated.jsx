// An extension of the React route component for checking that the user is logged in
import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Session } from 'meteor/session';

const Authenticated = ({ loggingIn, authenticated, component, ...rest}) => (
	<Route {...rest} render={(props) => {
		if(loggingIn) return <div>Logging In</div>;
		return Meteor.user()
			? Session.get('masterKeyConfigured')
				? localStorage.dashMasterKey
					? (React.createElement(component, { ...props, loggingIn, authenticated }))
					: (<Redirect to="/enterMasterKey" />)
				: (<Redirect to="/firstTimeKey" />)
			: (<Redirect to="/login" />);
	}} />
);

Authenticated.propTypes = {
	loggingIn: PropTypes.bool,
	authenticated: PropTypes.bool,
	component: PropTypes.func
};

export default Authenticated;
