// Helpers for the user interface

import { Bert } from 'meteor/themeteorchef:bert';

const handleError = error => {
	// If passed an error, alerts the user. Returns an object that
	// can be used to execute subsequent operations

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
