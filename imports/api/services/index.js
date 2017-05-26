import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

import { GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber } from '/imports/api/helpers.js';

// Create the Mongo collection
const Services = new Mongo.Collection('services');

// A service is one which is offered by the agency administring the dash instance
// es.g. SEO, design, development
const Service = GenericDashObject.inherit({
	name: 'Service',
	fields: {
		name: String
	}
});

export { Services, Service };
