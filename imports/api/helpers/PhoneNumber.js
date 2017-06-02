import GenericDashObject from '/imports/api/GenericDashObject';

// A phoneNumber is a phone number associated with a client or property
const PhoneNumber = GenericDashObject.inherit({
	name: 'Phone Number',
	fields: {
		tel: String, // The string of numbers constituting the phone number
		formatted: {
			// A helper that strips all non-digits
			type: String,
			transient: true,
			resolve: doc => {
				return doc.tel.replace(/\D/g, "");
			}
		}
	}
});

export default PhoneNumber;
