// Helpers for the user interface

// Import some global utilities
import React from 'react'; // React core
import Select from 'react-select'; // A nicely-styled select, directly exports
import { Bert } from 'meteor/themeteorchef:bert'; // A notifier

// If passed an error, alerts the user. Returns an object that
// can be used to execute subsequent operations
const handleError = error => {

	// If there's an error, log it and notify user
	if(error) {
		console.error(error);
		if(error.error) error = error.error; // In case it's nested, unnest it
		Bert.alert(error.reason, 'warning');
	}

	return {
		then (callback) {
			// If there hasn't been an error, execute the callback
			if(!error) callback();
		}
	}

};

// For viewing typeahead results. Exports a list with results,
// executes onSelect when one is clicked
const TypeaheadResults = ({ results, onSelect }) => (
	<ul className="list list--typeahead">
		{results.map(result => <li key={result._id} onClick={event => {
			onSelect(event.target.dataset.id);
		}} data-id={result._id}>{result.name}</li>)}
	</ul>
);

// A utility component for renaming a passed object
// Requires that the field for the name is called `name`
class Renamer extends React.Component {
	constructor (props) {
		super(props);
		// This component has state - whether or not it's renaming the object
		this.state = {
			isRenaming: false
		}
	}

	render () {
		// Returns the name and and edit icon if not renaming,
		// returns the form to rename if it is
		return this.state.isRenaming
		? <form
				onSubmit={event => {
					event.preventDefault();
					this.props.object.name = $(event.target).find('[name=name]').val();
					this.props.onSubmit(this.props.object);
					this.setState({isRenaming: false});
				}}
				>
				<input
					type="text"
					name="name"
					defaultValue={this.props.object.name}
				/>
				<input type="submit" value="save" />
			</form>
		: <span>{this.props.object.name}<button className="renamer" onClick={event => {
			event.preventDefault();
			this.setState({isRenaming: true});
		}}><i className="mdi mdi-pencil"></i></button></span>
	}
}

// Utility component for consistenly showing an icon for an
// object type
const DashIcon = ({ of }) => Object({
	credential: <i className="mdi mdi-key"></i>,
	physicalAddress: <i className="mdi mdi-map-marker"></i>,
	emailAddress: <i className="mdi mdi-email"></i>,
	phoneNumber: <i className="mdi mdi-phone"></i>,
	person: <i className="mdi mdi-account-multiple"></i>
})[of];

export { handleError, TypeaheadResults, Renamer, Select, DashIcon };
