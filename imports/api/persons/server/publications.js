import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Person } from '/imports/api/persons';

Meteor.publish('/persons/list', () => Person.find());

Meteor.publish('/persons/view', person => {
	if(typeof person === 'string') person = Person.findOne(person);
	const cursors = [];
	cursors.push(person.clients());
	cursors.push(person.properties());
	cursors.push(Person.find(person._id));
	return cursors;
});
