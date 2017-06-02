// http://docs.meteor.com/api/methods.html

import { Meteor } from 'meteor/meteor';

import Property from '/imports/api/Property';

Meteor.methods({
	'/properties/create' (property) {
		// Creates a property
		let result = undefined;
		property.save((error, propertyId) => {
			if(error) {
				throw new Meteor.Error(error);
			} else {
				result = propertyId;
			}
		});
		return result;
	},
	'/properties/save' (property) {
		// Saves a single property. Checks for the possibility of a propertyId being
		// passed instead of a full property object
		if(typeof property === 'string') property = Property.findOne(property);
		property.save(error => {
			if(error) throw new Meteor.Error(error);
		});
		return;
	},
	'/properties/delete' (property) {
		// Deletes a single property. Checks for the possibility of a propertyId being
		// passed instead of a full property object
		if(typeof property === 'string') property = Property.findOne(property);
		property.remove(error => {
			if(error) {
				throw new Meteor.Error(error);
			}
		});
		return;
	}
});
