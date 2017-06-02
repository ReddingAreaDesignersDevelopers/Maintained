import React from 'react';
import PropTypes from 'prop-types';

import { EmailAddress } from '/imports/api/helpers';

const EmailAddressNew = ({ onSubmit }) => (
	<form
		className="email-address new"
		onSubmit={event => {
			event.preventDefault();
			const emailAddress = new EmailAddress({
				createdAt: new Date(),
				updatedAt: new Date(),
				address: $(event.target).find('[name=address]').val()
			});
			onSubmit(emailAddress);
		}}
		>
		<input
			required
			type="email"
			name="address"
			placeholder="Email Address"
		/>
		<input type="submit" value="Add Address" />
	</form>
)

const EmailAddressView = ({ emailAddress, index, onDelete, onUpdate, readonly }) =>
	readonly
	? <div className="email-address view">
		<i className="mdi mdi-email"></i>
		<span name="address"><a href={`mailto:${emailAddress.address}`}>{emailAddress.address}</a></span>
	</div>
	: <form
			className="email-address view"
			onSubmit={event => event.preventDefault()}
			>
			<input
				required
				type="email"
				name="address"
				defaultValue={emailAddress.address}
				placeholder="Email Address"
				onClick={event => event.target.select()}
				onChange={event => {
					emailAddress.address = event.target.value;
					onUpdate(emailAddress, index);
				}}
			/>
			<button className="remover" onClick={event => onDelete(index)}><i className="mdi mdi-delete"></i></button>
		</form>

class EmailAddressList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isAdding: false
		}
	}

	render() {
		return (
			<ul className={`email-address ${this.props.readonly ? 'readonly' : ''}`}>
				{this.props.emailAddresses.map(
					(emailAddress, index) => <li key={index}>
						<EmailAddressView
							emailAddress={emailAddress}
							readonly={this.props.readonly}
							index={index}
							onUpdate={(emailAddress, index) => {emailAddress.updatedAt = new Date(); this.props.onUpdate(emailAddress, index)}}
							onDelete={index => this.props.onDelete(index)}
						/>
					</li>
				)}
				{this.props.readonly ? null : <li>{this.state.isAdding
					? <EmailAddressNew onSubmit={emailAddress => {this.setState({isAdding: false}); this.props.onAdd(emailAddress)}} />
					: <button className="creater" onClick={event => this.setState({isAdding: true})}><i className="mdi mdi-plus"></i><i className="mdi mdi-email"></i></button>
				}</li>}
			</ul>
		);
	}
}

EmailAddressList.propTypes = {
	emailAddresses: PropTypes.array,
	readonly: PropTypes.bool,
	onUpdate: PropTypes.func,
	onAdd: PropTypes.func,
	onDelete: PropTypes.func
};

EmailAddressList.defaultProps = {
	emailAddresses: [],
	readonly: false,
	onUpdate: (emailAddress, index) => null,
	onAdd: (emailAddress) => null,
	onDelete: (index) => null
};

export { EmailAddressNew, EmailAddressView, EmailAddressList };
