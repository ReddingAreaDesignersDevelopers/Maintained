// http://docs.meteor.com/api/pubsub.html

import { Meteor } from 'meteor/meteor';

import Person from '/imports/api/Person';

Meteor.publish('/persons/list', () => Person.find());

Meteor.publish('/persons/view', person => {
	if(typeof person === 'string') person = Person.findOne(person);
	const cursors = [];
	cursors.push(person.clients());
	cursors.push(person.properties());
	cursors.push(Person.find(person._id));
	return cursors;
});
