import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Person, { PersonRole } from '/imports/api/Person';

import { PhysicalAddressList } from '/imports/ui/components/helpers/physicalAddress';
import { EmailAddressList } from '/imports/ui/components/helpers/emailAddress';
import { PhoneNumberList } from '/imports/ui/components/helpers/phoneNumber';

import { handleError, Renamer } from '/imports/ui/helpers';
import container from '/imports/ui/modules/container';

const PersonRoleComponent = ({ role, onChange, onDelete }) => (
	<form className="role" onSubmit={event => event.preventDefault()}>
		<input
			defaultValue={role.name}
			onChange={event => {
				role.name = event.target.value;
				onChange(role);
			}}
		/>
			at <Link to={role.object().url}>{role.object().name}</Link>
		<button className="remover" onClick={event => onDelete(role)}><i className="mdi mdi-delete"></i></button>
	</form>
)

class PersonView extends React.Component {

	static propTypes = {
		person: PropTypes.instanceOf(Person)
	}

	static defaultProps = {
		person: new Person()
	}

	render () {
		const person = this.props.person;
		return (
			<div className="person view">
				<h1>
					<Renamer
						object={person}
						onSubmit={person => Meteor.call('/persons/save', person, error => handleError(error))}
					/>
				</h1>
				<div className="client card">
					<h2><i className="mdi mdi-account"></i>Roles</h2>
					<ul className="client">
						{person.roles.map(
							(role, index) => <li key={index}>
								<PersonRoleComponent
									role={role}
									onChange={role => {
										person.roles[index] = role;
										Meteor.call('/persons/save', person, error => handleError(error));
									}}
									onDelete={role => {
										person.roles.splice(index, 1);
										Meteor.call('/persons/save', person, error => handleError(error));
									}}
								/></li>)}
					</ul>
				</div>
				<div className="physical-addresses card">
					<h2><i className="mdi mdi-map-marker"></i>Physical Addresses</h2>
					<PhysicalAddressList
						physicalAddresses={person.uniquePhysicalAddresses}
						onUpdate={(physicalAddress, index) => person.callMethod('updatePhysicalAddress', physicalAddress, index, error => handleError(error))}
						onAdd={physicalAddress => person.callMethod('addPhysicalAddress', physicalAddress, error => handleError(error))}
						onDelete={index => person.callMethod('removePhysicalAddress', index)}
					/>
				</div>
				<div className="email-address card">
					<h2><i className="mdi mdi-email"></i>Email Addresses</h2>
					<EmailAddressList
						emailAddresses={person.uniqueEmailAddresses}
						onUpdate={(emailAddress, index) => person.callMethod('updateEmailAddress', emailAddress, index, error => handleError(error))}
						onAdd={emailAddress => person.callMethod('addEmailAddress', emailAddress, error => handleError(error))}
						onDelete={index => person.callMethod('removeEmailAddress', index)}
					/>
				</div>
				<div className="phone-number card">
					<h2><i className="mdi mdi-phone"></i>Phone Numbers</h2>
					<PhoneNumberList
						phoneNumbers={person.uniquePhoneNumbers}
						onUpdate={(phoneNumber, index) => person.callMethod('updatePhoneNumber', phoneNumber, index, error => handleError(error))}
						onAdd={phoneNumber => person.callMethod('addPhoneNumber', phoneNumber, error => handleError(error))}
						onDelete={index => person.callMethod('removePhoneNumber', index)}
					/>
				</div>
			</div>
		);
	}
};

export default container(({match}, onData) => {
	const personId = match.params.personId;
	const subscription = Meteor.subscribe('/persons/view', personId);
	if(subscription.ready()) {
		const person = Person.findOne(personId);
		onData(null, {person, subscription});
	}
}, PersonView);
