// This file contains some components helpful
// for the display and manipulation of email addresses,
// wherever they may be found

import React from 'react'; // React core
import PropTypes from 'prop-types'; // For checking proper data passage

// Import EmailAddress class definition from API
import { EmailAddress } from '/imports/api/helpers';

// Import some ui helpers
import { DashIcon } from '/imports/ui/helpers';

// The EmailAddressNew component displays the form for
// adding a new email address and takes a single prop,
// `onSubmit`, which is executed after the emailAddress
// is constructed. Because emailAddresses do not have
// their own collection, if onSubmit is not passed,
// nothing will happen to the email address
const EmailAddressNew = ({ onSubmit }) => (
	<form
		className="email-address new"
		onSubmit={event => {
			event.preventDefault(); // Prevent the form from going anywhere we don't want
			// Construct the emailAddress instance
			const emailAddress = new EmailAddress({
				createdAt: new Date(),
				updatedAt: new Date(),
				address: $(event.target).find('[name=address]').val()
			});
			// Execute the `onsubmit` function passed
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
);

// Make sure the prop is kosher
EmailAddressNew.propTypes = {
	onSubmit: PropTypes.func // Function for calling after new address assembled
};

// Default prop values
EmailAddressNew.defaultProps = {
	onSubmit: (emailAddress) => null
};

// The EmailAddress View component displays an email address.
// If defined as readonly, just displays some plain text. Otherwise,
// displays a form with the email address and attaches handlers for
// updating and deleting
const EmailAddressView = ({ emailAddress, index, onDelete, onUpdate, readonly }) =>
	readonly
		? <div className="email-address view">
				<DashIcon of="emailAddress" />
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
						onUpdate(emailAddress, index); // Execute handler prop
					}}
				/>
				<button className="remover" onClick={event => onDelete(index)}><i className="mdi mdi-delete"></i></button>
			</form>

// Makes sure props passed to EmailAddressView are kosher.
// See EmailAddressList.propTypes for more detail
EmailAddressView.propTypes = {
	emailAddress: PropTypes.instanceOf(EmailAddress), // Should receive an emailAddress instance
	index: PropTypes.number, // To keep track of the emailAddress's position within the array
	// (all emailAddresses are found in arrays)
	onDelete: PropTypes.func,
	onUpdate: PropTypes.func,
	readonly: PropTypes.bool
};

// Default props in case they aren't passed
EmailAddressView.defaultProps = {
	emailAddress: new EmailAddress(), // A blank emailAddress instance
	index: -1, // Hopefully throws an error
	onDelete: (index) => null, // The buck stops here
	onUpdate: (emailAddress, index) => null, // and here
	readonly: false // Defaults to editable
}

// The EmailAddressList component is a sub-component of an object which owns emailAddresses.
// Coincidentally, emailAddresses will only ever appear in an array, because it would
// be silly to assume any context which accepts an email would not possibly have other
// emails associated
class EmailAddressList extends React.Component {
	constructor (props) {
		super(props);
		// Contains simple state to keep track of whether or not an
		// address is being added
		this.state = {
			isAdding: false
		}
	}

	render() {
		return (
			<ul className={`email-address ${this.props.readonly ? 'readonly' : ''}`}>
				{this.props.emailAddresses.map(
					// Map the email addresses passed to the component to list items
					// containing the view of a single address
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

// Checks to make sure the proper data are passed
EmailAddressList.propTypes = {
	emailAddresses: PropTypes.arrayOf(PropTypes.instanceOf(EmailAddress)), // Accepts an array of emailAddress instances
	readonly: PropTypes.bool, // Boolean for whether or not the list (and children) are readonly
	// This is useful when displaying the emailAddresses of a client, on the property's page
	// because we don't want to update an object's data from another object's view
	onUpdate: PropTypes.func, // Function to be called when an address is updated
	onAdd: PropTypes.func, // Function to be called when an address is added to the collection (emailAddresses prop)
	onDelete: PropTypes.func // Function to be called when an address is deleted
};

// Some defaults in case they are not passed
EmailAddressList.defaultProps = {
	emailAddresses: [], // An empty array
	readonly: false, // Default to editable
	onUpdate: (emailAddress, index) => null, // The buck stops here
	onAdd: (emailAddress) => null, // And here
	onDelete: (index) => null // And here
};

// This file exports all the components above
export { EmailAddressNew, EmailAddressView, EmailAddressList };
