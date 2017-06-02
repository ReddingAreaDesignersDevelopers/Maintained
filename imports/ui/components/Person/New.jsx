import { Meteor } from 'meteor/meteor';
import React from 'react';

import Person, { PersonRole } from '/imports/api/Person';

import { handleError } from '/imports/ui/helpers';

const PersonNew = ({ history, roleAt, onSubmit }) => (
	<form
		className="person new"
		onSubmit={event => {
			event.preventDefault();
			const person = new Person({
				name: $(event.target).find('[name=name]').val(),
				roles: [new PersonRole({
					name: $(event.target).find('[name=roleName]').val(),
					objectType: roleAt.type,
					objectId: roleAt._id
				})]
			});
			Meteor.call('/persons/create', person, (error, personId) => {
				handleError(error).then(() => {
					onSubmit(person);
				});
			});
		}}>
		<input type="text" name="name" placeholder="Person Name" />
		<input type="text" name="roleName" placeholder={`Role at ${roleAt.name}`} />
		<input type="submit" value="Save" />
	</form>
);

export default PersonNew;
