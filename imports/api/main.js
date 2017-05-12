// Collections are uppercase, plural e.g. Clients = new Mongo.Collection()
// Classes are uppercase, singular e.g. Client = GenericDashObject.inherit({collection: Clients})
// Cursors are lowercase, plural e.g. clients = Client.find()
// Instances are lowercase, singular e.g. client = new Client()

import { Class, Enum, Type, Validator } from 'meteor/jagi:astronomy';

const Note = Class.create({
	name: 'Note',
	fields: {
		body: String
	}
});

const GenericDashObject = Class.create({
	name: 'Generic Dash Object',
	typeField: 'type',
	fields: {
		notes: [Note],
		createdAt: {
			type: Date,
			immutable: true
		},
		updatedAt: Date
	},
	events: {
		beforeInsert (event) {
			event.currentTarget.createdAt = new Date();
		},
		beforeSave (event) {
			event.currentTarget.updatedAt = new Date();
		}
	}
});

const PhysicalAddress = GenericDashObject.inherit({
	name: 'Physical Address',
	fields: {
		addressLocality: String,
		addressRegion: String,
		streetAddress: String,
		postalCode: String
	}
});

const EmailAddress = GenericDashObject.inherit({
	name: 'Email Address',
	fields: {
		address: String,
		credentialId: Mongo.ObjectId
	}
});

const PhoneNumber = GenericDashObject.inherit({
	name: 'Phone Number',
	fields: {
		tel: String
	}
});
