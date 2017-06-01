import React from 'react';

class EnterMasterKey extends React.Component {
	render () {
		return (
			<form
				onSubmit={event => {
					event.preventDefault();
					localStorage.dashMasterKey = $(event.target).find('[name=key]').val();
					this.props.history.push('/');
				}}
				>
				<input type="text" name="key"/>
				<input type="submit" value="Enter"/>
			</form>
		);
	}
}

export default EnterMasterKey;
