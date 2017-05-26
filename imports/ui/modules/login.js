import { Meteor } from 'meteor/meteor';
import 'jquery-validation';
import { handleError } from '/imports/ui/helpers';

const login = component => {
	const email = document.querySelector('[name=email]').value;
	const password = document.querySelector('[name=password]').value;

	Meteor.loginWithPassword(email, password, error => {
		handleError(error).then(() => {
			component.props.history.push('/');
		});
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
