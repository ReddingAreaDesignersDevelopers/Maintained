import React from 'react';
import CredentialView from '/imports/ui/components/credentials/view';
import CredentialNew from '/imports/ui/components/credentials/new';

class CredentialList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isAdding: false
		};
	}

	render () {
		return (
			<ul className="list list__credentials">
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
