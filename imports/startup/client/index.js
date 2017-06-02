import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Session } from 'meteor/session';
import { render }from 'react-dom';

import DashSetting from '/imports/api/helpers/DashSetting';

import App from '/imports/ui/layouts/App';

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
