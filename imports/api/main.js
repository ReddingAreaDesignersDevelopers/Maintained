// Collections are uppercase, plural e.g. Clients = new Mongo.Collection()
// Classes are uppercase, singular e.g. Client = GenericDashObject.inherit({collection: Clients})
// Cursors are lowercase, plural e.g. clients = Client.find()
// Instances are lowercase, singular e.g. client = new Client()

import { Class, Enum, Type, Validator } from 'meteor/jagi:astronomy';
import { Mongo } from 'meteor/mongo';
