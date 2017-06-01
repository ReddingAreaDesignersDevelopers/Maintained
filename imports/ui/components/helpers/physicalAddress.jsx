import React from 'react';
import PropTypes from 'prop-types';
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

const PhysicalAddressView = ({ physicalAddress, index, onDelete, onUpdate, readonly }) =>
	readonly
		? <div className="physicalAddress physicalAddress--view">
				<i className="mdi mdi-map-marker"></i>
				<span name="streetAddress">{physicalAddress.streetAddress}</span>
				<span name="addressLocality">{physicalAddress.addressLocality}</span>
				<span name="addressRegion">{physicalAddress.addressRegion}</span>
				<span name="postalCode">{physicalAddress.postalCode}</span>
			</div>
		: <form
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
				<button className="remover" onClick={event => onDelete(index)}><i className="mdi mdi-delete"></i></button>
			</form>


class PhysicalAddressList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isAdding: false
		};
	}

	render () {
		return (
			<ul className={`list list__physicalAddresses${this.props.readonly ? ' readonly' : ''}`}>
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
						? <PhysicalAddressNew onSubmit={physicalAddress => {this.setState({isAdding: false}); this.props.onAdd(physicalAddress)}} />
						: <button className="creater" onClick={event => this.setState({isAdding: true})}><i className="mdi mdi-plus"></i><i className="mdi mdi-map-marker"></i></button>
					}</li>}

			</ul>
		);
	}
}

PhysicalAddressList.propTypes = {
	physicalAddresses: PropTypes.array,
	readonly: PropTypes.bool,
	onUpdate: PropTypes.func,
	onAdd: PropTypes.func,
	onDelete: PropTypes.func
};

PhysicalAddressList.defaultProps = {
	physicalAddresses: [],
	readonly: false,
	onUpdate: (physicalAddress, index) => null,
	onAdd: (physicalAddress) => null,
	onDelete: (index) => null
};

export { PhysicalAddressNew, PhysicalAddressView, PhysicalAddressList };
