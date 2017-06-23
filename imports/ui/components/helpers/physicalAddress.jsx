// Components for viewing and updating physical addresses.
// Like email addresses and phone numbers, physical addresses
// must be attached to a larger object like site or property

// Some global utilties
import React from 'react'; // React core
import PropTypes from 'prop-types'; // For ensuring proper data passage

// Import PhysicalAddress class definition from API
import { PhysicalAddress } from '/imports/api/helpers';

// Import ui helpers
import { DashIcon } from '/imports/ui/helpers';

// This component is for making a new physicalAddress.
// It takes an onSubmit handler, to which it passes the
// physicalAddress after it's assembled. Because physicalAddresses
// must be attached to something (and, coincidentally, only in
// an array), if onSubmit is not passed, nothing happens
const PhysicalAddressNew = ({ onSubmit }) => (
	<form
		className="physical-address new"
		onSubmit={event => {
			event.preventDefault(); // Prevent the form from unexpected behavior
			// Now assemble the physicalAddress instance
			const physicalAddress = new PhysicalAddress({
				createdAt: new Date(),
				updatedAt: new Date(),
				addressLocality: $(event.target).find('[name=addressLocality]').val(),
				addressRegion: $(event.target).find('[name=addressRegion]').val(),
				streetAddress: $(event.target).find('[name=streetAddress]').val(),
				postalCode: $(event.target).find('[name=postalCode]').val()
			});
			// Pass the newly-assembled physicalAddress to the onSubmit handler
			onSubmit(physicalAddress);
		}}
		>
		<input required type="text" name="streetAddress" placeholder="Address" />
		<input required type="text" name="addressLocality" placeholder="City" />
		<input required type="text" name="addressRegion" placeholder="State" />
		<input required type="text" name="postalCode" placeholder="ZIP" />
		<input type="submit" value="Add Address" />
	</form>
);

// Make sure the onSubmit prop is a function
PhysicalAddressNew.propTypes = {
	onSubmit: PropTypes.func
};

// Default props in case they're not passed
PhysicalAddressNew.defaultProps = {
	onSubmit: (physicalAddress) => null // The buck stops here
};

// The component for viewing a physical address. Inherits props from PhysicalAddressList
// TODO display a map
const PhysicalAddressView = ({ physicalAddress, index, onDelete, onUpdate, readonly }) =>
	readonly
	// If readonly prop is set, just show basic data
		? <div className="physical-address view">
				<DashIcon of="physicalAddress" />
				<span name="streetAddress">{physicalAddress.streetAddress}</span>
				<span name="addressLocality">{physicalAddress.addressLocality}</span>
				<span name="addressRegion">{physicalAddress.addressRegion}</span>
				<span name="postalCode">{physicalAddress.postalCode}</span>
			</div>
		// If not readonly, show the form complete with delete/update handlers
		: <form
				className="physical-address view"
				onSubmit={event => event.preventDefault()}
				>
				<input
					required
					type="text"
					name="streetAddress"
					defaultValue={physicalAddress.streetAddress}
					placeholder="Address"
					onChange={event => {
						physicalAddress.streetAddress = event.target.value;
						onUpdate(physicalAddress, index);
					}}
				/>
				<input
					required
					type="text"
					name="addressLocality"
					defaultValue={physicalAddress.addressLocality}
					placeholder="City"
					onChange={event => {
						physicalAddress.addressLocality = event.target.value;
						onUpdate(physicalAddress, index);
					}}
				/>
				<input
					required
					type="text"
					name="addressRegion"
					defaultValue={physicalAddress.addressRegion}
					placeholder="State"
					onChange={event => {
						physicalAddress.addressRegion = event.target.value;
						onUpdate(physicalAddress, index);
					}}
				/>
				<input
					required
					type="text"
					name="postalCode"
					defaultValue={physicalAddress.postalCode}
					placeholder="ZIP"
					onChange={event => {
						physicalAddress.postalCode = event.target.value;
						onUpdate(physicalAddress, index);
					}}
				/>
				<button className="remover" onClick={event => onDelete(index)}><i className="mdi mdi-delete"></i></button>
			</form>

// Make sure proper props are pased to component
PhysicalAddressView.propTypes = {
	physicalAddress: PropTypes.instanceOf(PhysicalAddress),
	index: PropTypes.number, // For keeping track of position within PhysicalAddressList.props.physicalAddresses
	// Indexes are used to ensure tha the right address is being updated
	onDelete: PropTypes.func, // Handler to be called when an address is removed.
	// Remember that physical addresses must be owned and cannot be added or deleted independently
	onUpdate: PropTypes.func, // Handler called when address updated
	readonly: PropTypes.bool // Whether or not the address can be updated. Useful to be readonly
	// for example when displaying a client's address on a property's page. We don't
	// want to update an object's data without being on its page
};

// Set default value for props
PhysicalAddressView.defaultProps = {
	physicalAddress: new PhysicalAddress(), // A blank, new physicalAddress
	index: -1, // Should throw an error
	onDelete: (index) => null, // The buck stops here
	onUpdate: (physicalAddress, index) => null, // And here
	readonly: false // Default to editable
};

// Displays a list of physicalAddresses, passed via prop.
// Receives and passes handlers for CRUDding them according
// to the will of the parent component/object
class PhysicalAddressList extends React.Component {
	constructor (props) {
		super(props);
		// State whether or not a physicalAddress is being added
		this.state = {
			isAdding: false // Defaults to not adding
		};
	}

	render () {
		return (
			<ul className={`physical-address ${this.props.readonly ? 'readonly' : ''}`}>
				{/* Maps passed physicalAddresses to views, passing handlers */}
				{this.props.physicalAddresses.map((physicalAddress, index) => <li key={index}>
						<PhysicalAddressView
							physicalAddress={physicalAddress}
							index={index}
							readonly={this.props.readonly}
							onUpdate={(physicalAddress, index) => {physicalAddress.updatedAt = new Date(); this.props.onUpdate(physicalAddress, index)}}
							onDelete={index => this.props.onDelete(index)}
						/>
					</li>)}
					{this.props.readonly ? null : <li>{this.state.isAdding
						? <PhysicalAddressNew onSubmit={physicalAddress => {
							this.setState({isAdding: false}); // First set the state to initial
							this.props.onAdd(physicalAddress); // Call the handler to attach the passed physicalAddress to owner
						}} />
						: <button className="creater" onClick={event => this.setState({isAdding: true})}><i className="mdi mdi-plus"></i><i className="mdi mdi-map-marker"></i></button>
					}</li>}

			</ul>
		);
	}
}

// Make sure the passed props are of the proper type
PhysicalAddressList.propTypes = {
	physicalAddresses: PropTypes.arrayOf(PropTypes.instanceOf(PhysicalAddress)), // Accepts an array of physicalAddress instances
	readonly: PropTypes.bool, // Boolean for whether or not the list (and children) are readonly
	// This is useful when displaying the physicalAddresses of a client, on the property's page
	// because we don't want to update an object's data from another object's view
	onUpdate: PropTypes.func, // Function to be called when an address is updated
	onAdd: PropTypes.func, // Function to be called when an address is added to the collection (emailAddresses prop)
	onDelete: PropTypes.func // Function to be called when an address is deleted
};

// Default props in case they aren't passed.
PhysicalAddressList.defaultProps = {
	physicalAddresses: [], // Empty array
	readonly: false, // Default to editable
	onUpdate: (physicalAddress, index) => null, // The buck stops here
	onAdd: (physicalAddress) => null, // and here
	onDelete: (index) => null // and here
};

export { PhysicalAddressNew, PhysicalAddressView, PhysicalAddressList };
