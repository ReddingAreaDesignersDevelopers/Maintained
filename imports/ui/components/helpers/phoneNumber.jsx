// The components to be used whenever a phone number is displayed

// Global utilities
import React from 'react'; // React core
import PropTypes from 'prop-types'; // For ensuring proper data passage

// PhoneNumber class definition from API
import { PhoneNumber } from '/imports/api/helpers';

// Component for adding a new phoneNumber. Takes a single prop,
// `onSubmit`, executed after phoneNumber is assembled. Note that
// phoneNumbers are not stored on their own, so if onSubmit
// is not specified, nothing happens
const PhoneNumberNew = ({ onSubmit }) => (
	<form
		className="phone-number new"
		onSubmit={event => {
			event.preventDefault(); // Prevent the form from doing anything unexpected
			// Assemble the phoneNumber instance
			const phoneNumber = new PhoneNumber({
				createdAt: new Date(),
				updatedAt: new Date(),
				tel: $(event.target).find('[name=tel]').val()
			});
			// Execute the onSubmit handler
			onSubmit(phoneNumber);
		}}
		>
			<input required type="tel" name="tel" placeholder="Phone Number" />
			<input type="submit" value="Add Number" />
	</form>
);

// Make sure props are kosher
PhoneNumberNew.propTypes = {
	onSubmit: PropTypes.func // Should be a function
};

PhoneNumberNew.defaultProps = {
	onSubmit: (phoneNumber) => null // The buck stops here
};

// This component displays a phoneNumber. If set to readonly, it just shows a tel link.
// Otherwise it shows a form for updating it that calls handlers
// passed _through_ PhoneNumberList from the parent object
const PhoneNumberView = ({ phoneNumber, index, onDelete, onUpdate, readonly }) =>
	readonly
		? <div className="phone-number view">
			<i className="mdi mdi-phone"></i>
			<span name="tel"><a href={`tel:${phoneNumber.formatted}`}>{phoneNumber.tel}</a></span>
		</div>
		: <form
			className="phone-number view"
			onSubmit={event => event.preventDefault()}
			>
			<input
				required
				type="tel"
				name="tel"
				defaultValue={phoneNumber.tel}
				placeholder="Phone Number"
				onClick={event => event.target.select()}
				onChange={event => {
					phoneNumber.tel = event.target.value;
					onUpdate(phoneNumber, index);
				}}
			/>
			<button className="remover" onClick={event => onDelete(index)}><i className="mdi mdi-delete"></i></button>
		</form>

// See PhoneNumberList.propTypes for detailed explanation
PhoneNumberView.propTypes = {
	phoneNumber: PropTypes.instanceOf(PhoneNumber),
	index: PropTypes.number, // For keeping track of order within the array passed to PhoneNumberList
	onDelete: PropTypes.func,
	onUpdate: PropTypes.func,
	readonly: PropTypes.bool
};

PhoneNumberView.defaultProps = {
	phoneNumber: new PhoneNumber(),
	index: -1,
	onDelete: (index) => null,
	onUpdate: (phoneNumber, index) => null,
	readonly: false
};

// This component lists phoneNumbers which have been passed to it,
// and handles CRUDding those phoneNumbers for whomever the parent
// is (phoneNumbers must be attached to something)
class PhoneNumberList extends React.Component {
	constructor (props) {
		super(props);
		// Handles state to determine if a number is being added
		this.state = {
			isAdding: false
		};
	}

	render() {
		return (
			<ul className={`phone-number ${this.props.readonly ? 'readonly' : ''}`}>
				{this.props.phoneNumbers.map(
					// Maps passed phoneNumbers to list items containing the phoneNumber components
					(phoneNumber, index) => <li key={index}>
						<PhoneNumberView
							phoneNumber={phoneNumber}
							readonly={this.props.readonly}
							index={index}
							onUpdate={(phoneNumber, index) => {
								phoneNumber.updatedAt = new Date(); // Update the updatedAt before progressing
								this.props.onUpdate(phoneNumber, index); // Call the update prop
							}}
							onDelete={index => this.props.onDelete(index)}
						/>
					</li>
				)}
				{this.props.readonly
					? null
					: <li>{this.state.isAdding
						// If adding, show the new phoneNumber form,
						? <PhoneNumberNew onSubmit={phoneNumber => {this.setState({isAdding: false}); this.props.onAdd(phoneNumber)}} />
						// Otherwise show a button to toggle state
						: <button className="creater" onClick={event => this.setState({isAdding: true})}><i className="mdi mdi-plus"></i><i className="mdi mdi-phone"></i></button>
					}</li>
				}
			</ul>
		);
	}
}

// Make sure the data passed is kosher
PhoneNumberList.propTypes = {
	phoneNumbers: PropTypes.arrayOf(PropTypes.instanceOf(PhoneNumber)), // Should receive an array of phoneNumber instances
	readonly: PropTypes.bool, // Whether or not the phoneNumbers can be edited.
	// This is useful when displaying the phoneNumbers of a client, on the property's page
	// because we don't want to update an object's data from another object's view
	onUpdate: PropTypes.func, // Function to be called when a phoneNumber is updated
	onAdd: PropTypes.func, // Function to be called when a phoneNumber is added to the collection (phoneNumbers prop)
	onDelete: PropTypes.func // Function to be called when a phoneNumber is deleted
};

// Defaults in cased a prop is not passed
PhoneNumberList.defaultProps = {
	phoneNumbers: [], // An empty array
	readonly: false, // Default to being editable
	onUpdate: (phoneNumber, index) => null, // The buck stops here
	onAdd: (phoneNumber) => null, // And here
	onDelete: (index) => null // And here
};

// Export all the above components
export { PhoneNumberNew, PhoneNumberView, PhoneNumberList };
