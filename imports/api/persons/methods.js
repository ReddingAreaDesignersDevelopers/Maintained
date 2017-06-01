import { Meteor } from 'meteor/meteor';
import { Person } from '/imports/api/persons';

Meteor.methods({
	'/persons/create' (person) {
		// Creates a person
		let result = undefined;
		person.save((error, personId) => {
			if(error) {
				throw new Meteor.Error(error);
			} else {
				result = personId;
			}
		});
		return result;
	},
	'/persons/save' (person) {
		// Saves a single person. Checks for the possibility of a personId being
		// passed instead of a full person object
		if(typeof person === 'string') person = Person.findOne(person);
		person.save(error => {
			if(error) throw new Meteor.Error(error);
		});
		return;
	},
	'/persons/delete' (person) {
		// Deletes a single person. Checks for the possibility of a personId being
		// passed instead of a full person object
		if(typeof person === 'string') person = Person.findOne(person);
		person.remove(error => {
			if(error) {
				throw new Meteor.Error(error);
			}
		});
		return;
	}
});
