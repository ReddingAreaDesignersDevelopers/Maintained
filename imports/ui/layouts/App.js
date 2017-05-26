import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { compose } from 'react-komposer';


import Index from '/imports/ui/pages/Index';
import Authenticated from '/imports/ui/pages/Authenticated';
import Login from '/imports/ui/pages/Login';
import Navigation from '/imports/ui/components/Navigation';
import NotFound from '/imports/ui/pages/NotFound';

import ClientList from '/imports/ui/components/clients/list';
import ClientNew from '/imports/ui/components/clients/new';
import ClientView from '/imports/ui/components/clients/view';

const App = appProps => (
	<Router>
		<div className="App">
			<Navigation {...appProps} />
			<Switch>
				<Authenticated exact name="index" path="/" component={Index} />
				<Authenticated exact name="ClientList" path="/clients" component={ClientList} {...appProps} />
				<Authenticated exact name="ClientNew" path="/clients/new" component={ClientNew} {...appProps} />
				<Authenticated exact name="ClientView" path="/clients/:clientId" component={ClientView} {...appProps} />
				<Route path="/login" component={Login} {...appProps} />
				<Route component={NotFound} />
			</Switch>
		</div>
	</Router>
)

App.propTypes = {
	children: PropTypes.node
};

const composer = (props, onData) => {
	onData(null, {});
}

export default compose(composer)(App);
