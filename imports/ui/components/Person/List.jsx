import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Person from '/imports/api/Person';
import Client from '/imports/api/Client';
import Property from '/imports/api/Property';

import PersonNew from '/imports/ui/components/Person/New';

import container from '/imports/ui/modules/container';
import { PhysicalAddressList } from '/imports/ui/components/helpers/physicalAddress';
import { EmailAddressList } from '/imports/ui/components/helpers/emailAddress';
import { PhoneNumberList } from '/imports/ui/components/helpers/phoneNumber';

const PersonListItem = ({ person, roleAt }) => (
	<li>
		<Link to={person.url}>{person.name}</Link>
		<span className="person__role">{roleAt && person.roleAt(roleAt) ? `, ${person.roleAt(roleAt).name}` : null}</span>
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

PersonListItem.propTypes = {
	person: PropTypes.instanceOf(Person),
	roleAt: PropTypes.oneOfType([
		PropTypes.instanceOf(Client),
		PropTypes.instanceOf(Property)
	])
};

PersonListItem.defaultProps = {
	person: new Person(),
	roleAt: new Client()
};


class PersonList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isAdding: false
		};
	}

	static propTypes = {
		persons: PropTypes.array,
		roleAt: PropTypes.oneOfType([
			PropTypes.instanceOf(Client),
			PropTypes.instanceOf(Property)
		])
	}

	static defaultProps = {
		persons: Person.find().fetch(),
		roleAt: new Client()
	}

	render () {
		return (
			<ul className="person">
				{this.props.persons.map(person => <PersonListItem person={person} key={person._id} roleAt={this.props.roleAt}/>)}
				<li>{this.state.isAdding
					? <PersonNew
						roleAt={this.props.roleAt}
						onSubmit={personId => {
							this.setState({isAdding: false});
						}}
						/>
					: <button onClick={event => this.setState({isAdding: true})} className="creater"><i className="mdi mdi-plus"></i><i className="mdi mdi-clipboard-account"></i></button>
				}</li>
			</ul>
		);
	}
}

// This container wraps the component in a function that first makes sure
// that the data which it needs is available before it is rendered
export default container((props, onData) => {
	// TODO allow the component to accept an arbitrary list of persons, not just all
	const subscription = Meteor.subscribe('/persons/list');
	if(subscription.ready()) {
		// const persons = Person.find().fetch();
		onData(null, {});
	}
}, PersonList);
