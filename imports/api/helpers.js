import { Class } from 'meteor/jagi:astronomy';
import { Mongo } from 'meteor/mongo';

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
		notes: {
			type: [Note],
			default: () => []
		},
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
		credentialId: Mongo.ObjectID
	}
});

const PhoneNumber = GenericDashObject.inherit({
	name: 'Phone Number',
	fields: {
		tel: String
	}
});


export { Note, GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber };
