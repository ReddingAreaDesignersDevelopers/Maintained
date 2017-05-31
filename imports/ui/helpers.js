// Helpers for the user interface
import React from 'react';
import Select from 'react-select';
import { Bert } from 'meteor/themeteorchef:bert';

const handleError = error => {
	// If passed an error, alerts the user. Returns an object that
	// can be used to execute subsequent operations

	if(error) {
		console.error(error);
		if(error.error) error = error.error;
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

class Renamer extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isRenaming: false
		}
	}

	render () {
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

export { handleError, TypeaheadResults, Renamer, Select };
