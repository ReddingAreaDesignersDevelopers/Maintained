import React from 'react';
import { PhysicalAddress } from '/imports/api/helpers';

const PhysicalAddressNew = ({ onSubmit }) => (
	<form
		id="phsyicalAddressNew"
		onSubmit={event => {
			event.preventDefault();
			const physicalAddress = new PhysicalAddress({
				createdAt: new Date(),
				updatedAt: new Date(),
				addressLocality: $(event.target).find('[name=addressLocality]').val(),
				addressRegion: $(event.target).find('[name=addressRegion]').val(),
				streetAddress: $(event.target).find('[name=streetAddress]').val(),
				postalCode: $(event.target).find('[name=postalCode]').val()
			});
			onSubmit(physicalAddress);
		}}
		>
		<input required type="text" name="streetAddress" placeholder="Address" />
		<input required type="text" name="addressLocality" placeholder="City" />
		<input required type="text" name="addressRegion" placeholder="State" />
		<input required type="text" name="postalCode" placeholder="ZIP" />
		<input type="submit" value="Add Address" />
	</form>
)

const PhysicalAddressView = ({ physicalAddress, index, onDelete, onUpdate }) => (
	<form
		className="physicalAddress physicalAddress--view"
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
		<input
			type="button"
			value="delete"
			onClick={event => onDelete(index)}
		/>
	</form>
)

class PhysicalAddressList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isAdding: false
		};
	}

	render () {
		var index = 0;
		return (
			<ul className="list list__physicalAddresses">
				{this.props.physicalAddresses.map(physicalAddress => {
					let jsx = <li key={index}>
						<PhysicalAddressView
							physicalAddress={physicalAddress}
							index={index}
							onUpdate={(physicalAddress, index) => {physicalAddress.updatedAt = new Date(); this.props.onUpdate(physicalAddress, index)}}
							onDelete={index => this.props.onDelete(index)}
						/>
					</li>;
					index++;
					return jsx;
				})}
				<li>{this.state.isAdding
					? <PhysicalAddressNew onSubmit={physicalAddress => {this.setState({isAdding: false}); this.props.onAdd(physicalAddress)}} />
					: <button onClick={event => this.setState({isAdding: true})}>Add Physical Address</button>
				}</li>
			</ul>
		);
	}
}

export { PhysicalAddressNew, PhysicalAddressView, PhysicalAddressList };
