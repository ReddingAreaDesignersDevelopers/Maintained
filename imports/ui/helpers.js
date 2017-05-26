import { Bert } from 'meteor/themeteorchef:bert';

const handleError = error => {

	if(error) {
		console.error(error);
		Bert.alert(error.reason, 'warning');
	}

	return {
		then (callback) {
			if(!error) callback();
		}
	}

};

export { handleError };
