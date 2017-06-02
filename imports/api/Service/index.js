import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

import GenericDashObject from '/imports/api/GenericDashObject';
import Property from '/imports/api/Property';

import { PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers';

// Create the Mongo collection
export const Services = new Mongo.Collection('services');

// A service is one which is offered by the agency administring the dash instance
// es.g. SEO, design, development
const Service = GenericDashObject.inherit({
	name: 'Service',
	collection: Services,
	fields: {
		name: String,
		url: {
			type: String,
			transient: true,
			resolve: (doc) => `/services/${doc._id}`
		}
	},
	helpers: {
		properties () {
			return Property.find({serviceIds: {$in: [this._id]}});
		}
	}
});

export default Service;
