// Helpers for the user interface
import React from 'react';
import { Bert } from 'meteor/themeteorchef:bert';

const handleError = error => {
	// If passed an error, alerts the user. Returns an object that
	// can be used to execute subsequent operations

	if(error) {
		console.error(error);
		Bert.alert(error.reason, 'warning');
	}

	return {
		then (callback) {
			if(!error) callback();
		}
	}

};

const TypeaheadResults = ({ results, onSelect }) => (
	<ul className="list list--typeahead">
		{results.map(result => <li key={result._id} onClick={event => {
			onSelect(event.target.dataset.id);
		}} data-id={result._id}>{result.name}</li>)}
	</ul>
);

export { handleError, TypeaheadResults };
