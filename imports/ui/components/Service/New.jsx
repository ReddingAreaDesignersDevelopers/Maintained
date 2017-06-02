import { Meteor } from 'meteor/meteor';
import React from 'react';

import Service from '/imports/api/Service';

import { handleError } from '/imports/ui/helpers';

const ServiceNew = ({ history }) => (
	<form
		className="service new"
		onSubmit={event => {
			event.preventDefault();
			const service = new Service({
				name: $(event.target).find('[name=name]').val()
			});
			Meteor.call('/services/create', service, (error, serviceId) => {
				handleError(error).then(() => {
					history.push(`/services/${serviceId}`);
				});
			});
		}}>
		<input type="text" name="name" placeholder="Service Name" />
		<input type="submit" value="Save" />
	</form>
);

export default ServiceNew;
