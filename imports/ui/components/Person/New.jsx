import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import Client from '/imports/api/Client';
import Property from '/imports/api/Property';
import Person, { PersonRole } from '/imports/api/Person';

import { handleError, TypeaheadResults } from '/imports/ui/helpers';

class PersonNew extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			personMatches: [],
			personSelected: false,
		};
	}

	render () {
		const { history, roleAt, onSubmit } = this.props;
		return (
			<form
				className="person new"
				onSubmit={event => {
					event.preventDefault();
					const role = new PersonRole({
						name: $(event.target).find('[name=roleName]').val(),
						objectType: roleAt.type,
						objectId: roleAt._id
					});
					const personExists = $(event.target).find('[name=personId]').val();
					if(personExists) {
						const person = Person.findOne(personExists);
						person.roles.push(role);
						Meteor.call('/persons/save', person, (error, personId) => {
							handleError(error).then(() => onSubmit(personId));
						});
					} else {
						const person = new Person({
							name: $(event.target).find('[name=name]').val(),
							roles: [role]
						});
						Meteor.call('/persons/create', person, (error, personId) => {
							handleError(error).then(() => onSubmit(personId));
						});
					}
				}}>
				<label htmlFor="name">
					Person Name
					<input type="text" required name="name" autoComplete="off" placeholder="Person Name" onKeyUp={event => {
						const maxResults = 5;
						this.setState({personSelected: false});
						const personMatches = _.first(_.filter(Person.find().fetch(), person => {
							return person.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0;
						}), maxResults);
						this.setState({personMatches});
					}} />
				</label>
				<input type="hidden" name="personId"/>
				{this.state.personSelected
					? ''
					: <TypeaheadResults results={this.state.personMatches} onSelect={personId => {
							this.setState({personSelected: true});
							const person = Person.findOne(personId);
							$('[name=personId]').val(personId);
							$('[name=name]').val(person.name);
						}} />
				}
				<input type="text" name="roleName" placeholder={`Role at ${roleAt.name}`} />
				<input type="submit" value="Save" />
			</form>
		);
	}
}

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
