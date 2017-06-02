import { Class } from 'meteor/jagi:astronomy';

// A note has only a body and may be attached to any item
// which inherits properties from the GenericDashObject
export const Note = Class.create({
	name: 'Note',
	fields: {
		body: String // The text of the note
	}
});

// The generic class which other objects inherit
// It will be useful for just about everything stored here
// to keep track of when it was created, when it was updated,
// and to take notes on that object
const GenericDashObject = Class.create({
	name: 'Generic Dash Object',
	typeField: 'type',
	fields: {
		notes: {
			type: [Note], // An array of notes about the object
			default: () => [] // Default to being an empty array
		},
		createdAt: {
			type: Date,
			default: () => new Date()
			// immutable: true
			// Should be immutable, but a bug makes the field disappear
		},
		updatedAt: {
			type: Date,
			default: () => new Date()
		}
	},
	events: {
		beforeInsert (event) {
			// Assigns the createdAt property automatically before insertion into the database
			event.currentTarget.createdAt = new Date();
		},
		beforeSave (event) {
			// Assigns the createdAt property automatically every time the object is saved
			event.currentTarget.updatedAt = new Date();
		}
	}
});

export default GenericDashObject;
