import React from 'react';
import { EmailAddress } from '/imports/api/helpers';

const EmailAddressNew = ({ onSubmit }) => (
	<form
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
		<input required type="email" name="address" placeholder="Email Address" />
		<input type="submit" value="Add Address" />
	</form>
)

const EmailAddressView = ({ emailAddress, index, onDelete, onUpdate }) => (
	<form
		className="emailAddress emailAddress--view"
		onSubmit={event => event.preventDefault()}
		>
		<input
			required
			type="email"
			name="address"
			defaultValue={emailAddress.address}
			placeholder="Email Address"
			onChange={event => {
				emailAddress.address = event.target.value;
				onUpdate(emailAddress, index);
			}}
		/>
		<input
			type="button"
			value="delete"
			onClick={event => onDelete(index)}
		/>
	</form>
)

class EmailAddressList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isAdding: false
		}
	}

	render() {
		var index = 0;
		return (
			<ul className="list list__emailAddresses">
				{this.props.emailAddresses.map(emailAddress => {
					let jsx = <li key={index}>
						<EmailAddressView
							emailAddress={emailAddress}
							index={index}
							onUpdate={(emailAddress, index) => {emailAddress.updatedAt = new Date(); this.props.onUpdate(emailAddress, index)}}
							onDelete={index => this.props.onDelete(index)}
						/>
					</li>;
					index++;
					return jsx;
				})}
				<li>{this.state.isAdding
					? <EmailAddressNew onSubmit={emailAddress => {this.setState({isAdding: false}); this.props.onAdd(emailAddress)}} />
					: <button onClick={event => this.setState({isAdding: true})}>Add Email Address</button>
				}</li>
			</ul>
		);
	}
}

export { EmailAddressNew, EmailAddressView, EmailAddressList };
