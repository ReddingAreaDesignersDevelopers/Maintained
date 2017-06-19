// Because let's not use eval()

import Client from '/imports/api/Client';
import Credential from '/imports/api/Credential';
import Person from '/imports/api/Person';
import Property from '/imports/api/Property';
import Service from '/imports/api/Service';
import Snippet from '/imports/api/Snippet';
import User from '/imports/api/User';

const collectionByName = (collectionName) => {
	let collection;
	collectionName = collectionName.toLowerCase();
	switch (collectionName) {
		case 'client':
			collection = Client;
			break;
		case 'credential':
			collection = Credential;
			break;
		case 'person':
			collection = Person;
			break;
		case 'property':
			collection = Property;
			break;
		case 'service':
			collection = Service;
			break;
		case 'snippet':
			collection = Snippet;
			break;
		case 'user':
			collection = User;
			break;
	}
	return collection;
}

export default collectionByName;
