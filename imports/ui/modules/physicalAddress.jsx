import React from 'react';
import { PhysicalAddress } from '/imports/api/helpers';

class PhysicalAddressNew extends React.Component {
	render () {
		return (
			<form
				id="phsyicalAddressNew"
				onSubmit={event => {
					event.preventDefault();
					const physicalAddress = new PhysicalAddress({
						createdAt: new Date(),
						addressLocality: $(event.target).find('[name=addressLocality]').val(),
						addressRegion: $(event.target).find('[name=addressRegion]').val(),
						streetAddress: $(event.target).find('[name=streetAddress]').val(),
						postalCode: $(event.target).find('[name=postalCode]').val()
					});
					console.log('new', physicalAddress);
					this.props.onSubmit(physicalAddress);
				}}
				>
					<input required type="text" name="streetAddress" placeholder="Address" />
					<input required type="text" name="addressLocality" placeholder="City" />
					<input required type="text" name="addressRegion" placeholder="State" />
					<input required type="text" name="postalCode" placeholder="ZIP" />
					<input type="submit" value="Add Address" />
			</form>
		);
	}
}

class PhysicalAddressView extends React.Component {
	render () {
		const physicalAddress = this.props.physicalAddress;
		return (
			<form
				className="physicalAddress physicalAddress--view"
				onSubmit={event => event.preventDefault()}
				>
					<input required type="text" name="streetAddress" value={physicalAddress.streetAddress} placeholder="Address" />
					<input required type="text" name="addressLocality" value={physicalAddress.addressLocality} placeholder="City" />
					<input required type="text" name="addressRegion" value={physicalAddress.addressRegion} placeholder="State" />
					<input required type="text" name="postalCode" value={physicalAddress.postalCode} placeholder="ZIP" />
					<input
						type="button"
						value="delete"
						onClick={event => this.props.onDelete(this.props.index)}
					/>
			</form>
		);
	}
}

export { PhysicalAddressNew, PhysicalAddressView };
