import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';

import Person from '/imports/api/Person';

import PersonNew from '/imports/ui/components/Person/New';

import container from '/imports/ui/modules/container';
import { PhysicalAddressList } from '/imports/ui/components/helpers/physicalAddress';
import { EmailAddressList } from '/imports/ui/components/helpers/emailAddress';
import { PhoneNumberList } from '/imports/ui/components/helpers/phoneNumber';

const PersonListItem = ({ person, roleAt }) => (
	<li>
		<Link to={person.url}>{person.name}</Link>
		<span className="person__role">{roleAt ? `, ${person.roleAt(roleAt).name}` : null}</span>
		<PhysicalAddressList
			readonly
			physicalAddresses={person.uniquePhysicalAddresses}
		/>
		<EmailAddressList
			readonly
			emailAddresses={person.uniqueEmailAddresses}
		/>
		<PhoneNumberList
			readonly
			phoneNumbers={person.uniquePhoneNumbers}
		/>
	</li>
);


class PersonList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isAdding: false
		};
	}

	render () {
		return (
			<ul className="person">
				{this.props.persons.map(person => <PersonListItem person={person} key={person._id} roleAt={this.props.roleAt}/>)}
				<li>{this.state.isAdding
					? <PersonNew
						roleAt={this.props.roleAt}
						onSubmit={person => {
							this.state({isAdding: false});
						}}
						/>
					: <button onClick={event => this.setState({isAdding: true})} className="creater"><i className="mdi mdi-plus"></i><i className="mdi mdi-clipboard-account"></i></button>
				}</li>
			</ul>
		);
	}
}
//
// const PersonList = ({ persons, roleAt, onAdd, onUpdate, onDelete }) => (
//
// );

export default container((props, onData) => {
	const subscription = Meteor.subscribe('/persons/list');
	if(subscription.ready()) {
		const persons = Person.find().fetch();
		onData(null, {persons});
	}
}, PersonList);
