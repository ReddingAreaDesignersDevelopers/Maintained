import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import container from '/imports/ui/modules/container';
import { handleError, Select } from '/imports/ui/helpers';

const Navigation = withRouter(({ hasUser, history }) => hasUser ? (
			<Select
				value={history.location.pathname}
				clearable={false}
				options={[
					{value: '/', label: 'Home'},
					{value: '/clients', label: 'Clients'},
					{value: '/properties', label: 'Properties'},
					{value: '/services', label: 'Services'},
					{value: '/login', label: 'Sign Out'}
				]}
				onChange={selectedOption => {
					if(selectedOption.value === '/login') {
						Meteor.logout(error => {
							handleError(error).then(() => {
								history.push(selectedOption.value);
							});
						});
					} else {
						history.push(selectedOption.value);
					}
				}}
			/>
) : null);

export default container((props, onData) => {
	onData(null, {hasUser: Meteor.user()});
}, Navigation);
