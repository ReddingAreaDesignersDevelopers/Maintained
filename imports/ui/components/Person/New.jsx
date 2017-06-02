import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import Client from '/imports/api/Client';
import Property from '/imports/api/Property';
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

PersonNew.propTypes = {
	roleAt: PropTypes.oneOfType([
		PropTypes.instanceOf(Client),
		PropTypes.instanceOf(Property)
	]),
	onSubmit: PropTypes.func
};

PersonNew.defaultProps = {
	roleAt: new Client(),
	onSubmit: event => event.preventDefault()
};

export default PersonNew;
