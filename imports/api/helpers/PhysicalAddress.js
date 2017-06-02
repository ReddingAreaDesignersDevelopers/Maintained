import GenericDashObject from '/imports/api/GenericDashObject';

// A physicalAddress is a real location that may be assigned to a client or property.
// The field names below are schema.org conventions that are country-agnostic
const PhysicalAddress = GenericDashObject.inherit({
	name: 'Physical Address',
	fields: {
		addressLocality: String, // i.e. city
		addressRegion: String, // i.e. state
		streetAddress: String,
		postalCode: String, // i.e. ZIP
		// field for connecting to API endpoint, like google maps object ID, freebase, &c
	}
});

export default PhysicalAddress;
