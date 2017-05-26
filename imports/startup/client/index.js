import React from 'react';
import { render }from 'react-dom';
import { Meteor } from 'meteor/meteor';
import App from '/imports/ui/layouts/App';

// First thing on startup is to attach react to the DOM
Meteor.startup(() => {
	render(<App />, document.getElementById('react-root'));
});
