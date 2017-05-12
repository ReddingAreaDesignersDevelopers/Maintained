// A service is one which is offered by the agency administring the dash instance
// es.g. SEO, design, development

import { Mongo } from 'mongo';
import { Class } from 'meteor/jagi:astronomy';

const Services = new Mongo.Collection('services');

const Service = GenericDashObject.inherit({
	name: 'Service',
	fields: {
		name: String
	}
});
