// http://docs.meteor.com/api/methods.html

import { Meteor } from 'meteor/meteor';

import Service from '/imports/api/Service';

Meteor.methods({
	'/services/create' (service) {
		// Creates a service
		let result = undefined;
		service.save((error, serviceId) => {
			if(error) {
				throw new Meteor.Error(error);
			} else {
				result = serviceId;
			}
		});
		return result;
	},
	'/services/save' (service) {
		// Saves a single service. Checks for the possibility of a serviceId being
		// passed instead of a full service object
		if(typeof service === 'string') service = Service.findOne(service);
		service.save(error => {
			if(error) throw new Meteor.Error(error);
		});
		return;
	},
	'/services/delete' (service) {
		// Deletes a single service. Checks for the possibility of a serviceId being
		// passed instead of a full service object
		if(typeof service === 'string') service = Service.findOne(service);
		service.remove(error => {
			if(error) {
				throw new Meteor.Error(error);
			}
		});
		return;
	}
});
