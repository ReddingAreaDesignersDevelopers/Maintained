import React from 'react';
import { Link } from 'react-router-dom';

import User from '/imports/api/User';

import container from '/imports/ui/modules/container';

import UserNew from '/imports/ui/components/User/New';

const UserListItem = ({ user }) => (
	<li>
		<Link to={`/users/${user._id}`}>{user.name}</Link>
	</li>
);

class UserList extends React.Component {
	constructor (props) {
		super(props);
		console.log('props', props);
		this.state = {
			isAdding: false
		};
	}

	render () {
		return (
			<ul>
				{this.props.users.map(user => <UserListItem key={user._id} user={user} />)}
				<li>{this.state.isAdding
					? <UserNew history={this.props.history} onSubmit={() => this.setState({isAdding: false})} />
					: <button className="creater" onClick={event => this.setState({isAdding: true})}><i className="mdi mdi-plus"></i></button>
				}</li>
			</ul>
		);
	}
}


export default container(({match}, onData) => {
	// Get the data from the server before showing anything
	const subscription = Meteor.subscribe('/users/list');
	if(subscription.ready()) {
		const users = User.find().fetch();
		onData(null, {users});
	}
}, UserList);
