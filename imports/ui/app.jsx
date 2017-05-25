import React, { Component } from 'react';
import { Navigation } from '/imports/ui/components/navigation.jsx';
import '/imports/startup/client';

export const App = ({children}) => (
	<div>
		<Navigation />
		{ children }
	</div>
)
