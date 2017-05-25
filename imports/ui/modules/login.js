import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import 'jquery-validation';

const login = component => {
	const email = document.querySelector('[name=email]').value;
	const password = document.querySelector('[name=password]').value;

	Meteor.loginWithPassword(email, password, error => {
		if(error) {
			console.error(error);
			Bert.alert(error.reason, 'warning');
		} else {
			component.props.history.push('/');
		}
	});
}

const validate = component => {
	$(component.loginForm).validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true
			}
		},
		messages: {
			email: {
				required: 'Need an email address here',
				email: `This doesn't look like an email`
			},
			password: {
				required: 'Need a password here'
			}
		},
		submitHandler () {
			login(component);
		}
	});
};

export default function handleLogin(options) {
	component = options.component;
	validate(component);
}
