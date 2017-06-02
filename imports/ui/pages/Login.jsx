// THe login page. TODO buggy, shows up even when logged in
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Redirect } from 'react-router-dom';

import handleLogin from '/imports/ui/modules/login';
import container from '/imports/ui/modules/container';

class Login extends React.Component {

	componentWillMount () {
		const hasUser = Meteor.user();
		if(hasUser) {
			this.props.history.push('/');
		}
	}

	componentDidMount () {
		handleLogin({component: this});
	}

	handleSubmit (event) {
		event.preventDefault();
	}

	render () {
		return (
			<form
				ref={form => (this.loginForm = form)}
				className="Login"
				onSubmit={this.handleSubmit}
				>
				<input type="email" name="email" placeholder="Email Address" />
				<input type="password" name="password" placeholder="Password" />
				<input type="submit" value="login" />
			</form>
		);
	}
}

export default Login
