import React from 'react';
import { render }from 'react-dom';
import { Meteor } from 'meteor/meteor';
import App from '/imports/ui/layouts/App';
import { DashSetting } from '/imports/api/helpers.js';
import { Session } from 'meteor/session';

// First thing on startup is to attach react to the DOM
Meteor.startup(() => {
	Meteor.subscribe('/dashsettings', () => {
		var masterKeyConfigured = DashSetting.findOne({name: 'Master Key Configured'});
		masterKeyConfigured = masterKeyConfigured ? masterKeyConfigured.value : false;
		Session.set('masterKeyConfigured', masterKeyConfigured);
		Meteor.subscribe('/services/list');
		render(<App />, document.getElementById('react-root'));
	});
});
