// A component for listing credentials.
// Because credentials must be associated with another object,
// this component will always be inserted as a child of
// another compontnet

// Some global utilities
import React from 'react'; // React core
import PropTypes from 'prop-types'; // For checking proper data passage

// Imports the Credential class definition from the API
import Credential from '/imports/api/Credential';

// Other components used by this one
import CredentialView from '/imports/ui/components/Credential/View';
import CredentialNew from '/imports/ui/components/Credential/New';

// Given a list of credentials, CredentialList
// displays them and includes the ability to add a new one
class CredentialList extends React.Component {
	constructor (props) {
		super(props);
		// Credentials can be added inline (no redirect) so the component keeps track
		// of whether or not a credential is being added
		this.state = {
			isAdding: false
		};
	}

	// Data type checking
	static propTypes = {
		credentials: PropTypes.arrayOf(PropTypes.instanceOf(Credential)), // Should be passed an array of Credential instances
		onDelete: PropTypes.func, // A function to be executed when a credential is deleted
		onAdd: PropTypes.func, // A function to be executed when a credential is added
		// The onDelete and onAdd functions are passed by the parent component
		// and are used to dis/associate the credential with it owner
	}

	// Default data types
	static defaultProps = {
		credentials: [], // A blank array
		onDelete: () => {}, // A function that does nothing
		onAdd: () => {} // Another function that does nothing
	}

	render () {
		return (
			<ul className="credential">
				{/* Maps credenials to CredentialView instances */}
				{this.props.credentials.map(credential =>
					<li key={credential._id}>
						<CredentialView
							credential={credential}
							onDelete={credentialId => this.props.onDelete(credentialId)}
						/>
					</li>)}
				{/* Displays a button if doing nothing, displays the CredentialNew component if adding credential */}
				<li>{this.state.isAdding
						? <CredentialNew onSubmit={credentialId => {this.setState({isAdding: false}); this.props.onAdd(credentialId)}} />
						: <button className="creater" onClick={event => this.setState({isAdding: true})}><i className="mdi mdi-plus"></i><i className="mdi mdi-key"></i></button>
				}</li>
			</ul>
		);
	}
}

// This file only exports the above component
export default CredentialList;
