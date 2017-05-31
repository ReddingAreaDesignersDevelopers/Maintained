import React from 'react';
import PropTypes from 'prop-types';
import { PhoneNumber } from '/imports/api/helpers';

const PhoneNumberNew = ({ onSubmit }) => (
	<form
		onSubmit={event => {
			event.preventDefault();
			const phoneNumber = new PhoneNumber({
				createdAt: new Date(),
				updatedAt: new Date(),
				tel: $(event.target).find('[name=tel]').val()
			});
			onSubmit(phoneNumber);
		}}
		>
			<input required type="tel" name="tel" placeholder="Phone Number" />
			<input type="submit" value="Add Number" />
	</form>
)

const PhoneNumberView = ({ phoneNumber, index, onDelete, onUpdate, readonly }) => (
	<form
		className="phoneNumber phoneNumber--view"
		onSubmit={event => event.preventDefault()}
		>
		<input
			required
			readOnly={readonly ? 'readonly' : null}
			type="tel"
			name="tel"
			defaultValue={phoneNumber.tel}
			placeholder="Phone Number"
			onChange={event => {
				phoneNumber.tel = event.target.value;
				onUpdate(phoneNumber, index);
			}}
		/>
		{readonly
			? null
			: <button className="remover" onClick={event => onDelete(index)}><i className="mdi mdi-delete"></i></button>
		}
	</form>
)

class PhoneNumberList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isAdding: false
		}
	}

	render() {
		return (
			<ul className="list list__phoneNumbers">
				{this.props.phoneNumbers.map(
					(phoneNumber, index) => <li key={index}>
						<PhoneNumberView
							phoneNumber={phoneNumber}
							readonly={this.props.readonly}
							index={index}
							onUpdate={(phoneNumber, index) => {phoneNumber.updatedAt = new Date(); this.props.onUpdate(phoneNumber, index)}}
							onDelete={index => this.props.onDelete(index)}
						/>
					</li>
				)}
				{this.props.readonly ? null : <li>{this.state.isAdding
					? <PhoneNumberNew onSubmit={phoneNumber => {this.setState({isAdding: false}); this.props.onAdd(phoneNumber)}} />
					: <button className="creater" onClick={event => this.setState({isAdding: true})}><i className="mdi mdi-plus"></i><i className="mdi mdi-phone"></i></button>
				}</li>}
			</ul>
		);
	}
}

PhoneNumberList.propTypes = {
	phoneNumbers: PropTypes.array,
	readonly: PropTypes.bool,
	onUpdate: PropTypes.func,
	onAdd: PropTypes.func,
	onDelete: PropTypes.func
};

PhoneNumberList.defaultProps = {
	phoneNumbers: [],
	readonly: false,
	onUpdate: (phoneNumber, index) => null,
	onAdd: (phoneNumber) => null,
	onDelete: (index) => null
};

export { PhoneNumberNew, PhoneNumberView, PhoneNumberList };
