import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import container from '/imports/ui/modules/container';

class Index extends React.Component {
	componentWillMount () {
		const hasUser = this.props.hasUser;
		if(!hasUser) {
			this.props.history.push('/login');
		}
	}
	render () {
		return <h1>Hello, World!</h1>;
	}
}

export default container((props, onData) => {
	onData(null, {hasUser: Meteor.user()});
}, Index);
