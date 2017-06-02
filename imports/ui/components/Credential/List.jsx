import React from 'react';
import PropTypes from 'prop-types';

import Credential from '/imports/api/Credential';

import CredentialView from '/imports/ui/components/Credential/View';
import CredentialNew from '/imports/ui/components/Credential/New';

class CredentialList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isAdding: false
		};
	}

	static propTypes = {
		credentials: PropTypes.arrayOf(PropTypes.instanceOf(Credential)),
		onDelete: PropTypes.func,
		onAdd: PropTypes.func,
	}

	static defaultProps = {
		credentials: [],
		onDelete: () => {},
		onAdd: () => {}
	}

	render () {
		return (
			<ul className="credential">
				{this.props.credentials.map(credential =>
					<li key={credential._id}>
						<CredentialView
							credential={credential}
							onDelete={credentialId => this.props.onDelete(credentialId)}
						/>
					</li>)}
				<li>{this.state.isAdding
						? <CredentialNew onSubmit={credentialId => {this.setState({isAdding: false}); this.props.onAdd(credentialId)}} />
						: <button className="creater" onClick={event => this.setState({isAdding: true})}><i className="mdi mdi-plus"></i><i className="mdi mdi-key"></i></button>
				}</li>
			</ul>
		);
	}
}
export default CredentialList;
