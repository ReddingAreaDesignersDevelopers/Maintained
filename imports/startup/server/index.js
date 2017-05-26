import '/imports/startup/server/api.js';
import { Clients } from '/imports/api/clients';

Meteor.startup(function () {
	// Some helpers to allow searching.
	// Mongo doesn't allow text search unless it has
	// indexed specific fields
	Clients._ensureIndex({
		'name': 'text'
	});
});
