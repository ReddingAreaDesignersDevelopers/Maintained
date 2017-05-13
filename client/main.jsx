import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';


import '../imports/api/main.js';

// Import the core classes
import { Client } from '../imports/api/clients/clients.js';
import { Property } from '../imports/api/properties/properties.js';
import { Person } from '../imports/api/persons/persons.js';
import { Credential } from '../imports/api/credentials/credentials.js';
import { Snippet } from '../imports/api/snippets/snippets.js';
import { Service } from '../imports/api/services/services.js' ;

import '../imports/ui/app.html';
import App from '../imports/ui/app.jsx';


Meteor.startup(() => {
	render(<App />, document.getElementById('app'));
});
