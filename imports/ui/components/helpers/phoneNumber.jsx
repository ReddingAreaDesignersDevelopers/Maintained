import React from 'react';
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

const PhoneNumberView = ({ phoneNumber, index, onDelete, onUpdate }) => (
	<form
		className="phoneNumber phoneNumber--view"
		onSubmit={event => event.preventDefault()}
		>
		<input
			required
			type="tel"
			name="tel"
			defaultValue={phoneNumber.tel}
			placeholder="Phone Number"
			onChange={event => {
				phoneNumber.tel = event.target.value;
				onUpdate(phoneNumber, index);
			}}
		/>
		<input
			type="button"
			value="delete"
			onClick={event => onDelete(index)}
		/>
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
		var index = 0;
		return (
			<ul className="list list__phoneNumbers">
				{this.props.phoneNumbers.map(phoneNumber => {
					let jsx = <li key={index}>
						<PhoneNumberView
							phoneNumber={phoneNumber}
							index={index}
							onUpdate={(phoneNumber, index) => {phoneNumber.updatedAt = new Date(); this.props.onUpdate(phoneNumber, index)}}
							onDelete={index => this.props.onDelete(index)}
						/>
					</li>;
					index++;
					return jsx;
				})}
				<li>{this.state.isAdding
					? <PhoneNumberNew onSubmit={phoneNumber => {this.setState({isAdding: false}); this.props.onAdd(phoneNumber)}} />
					: <button onClick={event => this.setState({isAdding: true})}>Add Phone Number</button>
				}</li>
			</ul>
		);
	}
}

export { PhoneNumberNew, PhoneNumberView, PhoneNumberList };
