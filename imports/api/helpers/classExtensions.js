import { Meteor } from 'meteor/meteor';

import Credential from '/imports/api/Credential';

import PhysicalAddress from '/imports/api/helpers/PhysicalAddress';
import EmailAddress from '/imports/api/helpers/EmailAddress';
import PhoneNumber from '/imports/api/helpers/PhoneNumber';

export const extendWithPhysicalAddresses = classToExtend => {
	classToExtend.extend({
		fields: {
			uniquePhysicalAddresses: {
				type: [PhysicalAddress],
				default: () => []
			}
		}
	});
	if(Meteor.isServer) {
		classToExtend.extend({
			meteorMethods: {
				addPhysicalAddress (physicalAddress) {
					this.uniquePhysicalAddresses.push(physicalAddress);
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				},
				updatePhysicalAddress (physicalAddress, index) {
					this.uniquePhysicalAddresses[index] = physicalAddress;
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				},
	 			removePhysicalAddress (physicalAddressIndex) {
					// Removes a phone number from the client object via its index
					this.uniquePhysicalAddresses.splice(physicalAddressIndex, 1);
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				}
			}
		})
	}
}

export const extendWithEmailAddresses = classToExtend => {
	classToExtend.extend({
		fields: {
			uniqueEmailAddresses: {
				type: [EmailAddress],
				default: () => []
			}
		}
	});
	if(Meteor.isServer) {
		classToExtend.extend({
			meteorMethods: {
				addEmailAddress (emailAddress) {
					this.uniqueEmailAddresses.push(emailAddress);
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				},
				updateEmailAddress (emailAddress, index) {
					this.uniqueEmailAddresses[index] = emailAddress;
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				},
	 			removeEmailAddress (emailAddressIndex) {
					// Removes a phone number from the client object via its index
					this.uniqueEmailAddresses.splice(emailAddressIndex, 1);
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				}
			}
		})
	}
}


export const extendWithPhoneNumbers = classToExtend => {
	classToExtend.extend({
		fields: {
			uniquePhoneNumbers: {
				type: [PhoneNumber],
				default: () => []
			}
		}
	});
	if(Meteor.isServer) {
		classToExtend.extend({
			meteorMethods: {
				addPhoneNumber (phoneNumber) {
					this.uniquePhoneNumbers.push(phoneNumber);
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				},
				updatePhoneNumber (phoneNumber, index) {
					this.uniquePhoneNumbers[index] = phoneNumber;
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				},
	 			removePhoneNumber (phoneNumberIndex) {
					// Removes a phone number from the client object via its index
					this.uniquePhoneNumbers.splice(phoneNumberIndex, 1);
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				}
			}
		})
	}
}

export const extendWithCredentials = classToExtend => {
	classToExtend.extend({
		fields: {
			credentialIds: {
				type: [String], // TODO this should be a Mongo.ObjectID but validation isn't working
				default: () => []
			},
		}
	});
	if(Meteor.isServer) {
		classToExtend.extend({
			// The methods below are for adding, updating, and removing child classes
			// These methods are invoked on the client so as to provide shorthand
			// for updating this, secured, class
			meteorMethods: {
				addCredential (credentialId) {
					this.credentialIds.push(credentialId);
					this.save(error => {
						if(error) throw new Meteor.Error(error);
					});
				},
				removeCredential (credential) {
					// A method for removing a credential associated with the client,
					// and removing the link between the now non-existent credential

					// If a string was passed, guess that it may have been the id
					if(typeof credential === 'string') credential = Credential.findOne(credential);
					if(!credential) throw new Meteor.Error('Credential not found');
					const credentialId = credential._id;
					credential.remove(error => {
						if(error) throw new Meteor.Error(error);
						// Now remove the credential ID from the client object
						this.credentialIds.splice(this.credentialIds.indexOf(credentialId), 1);
						this.save(error => {
							if(error) throw new Meteor.Error(error);
						});
					});
				},

			}
		});
	}
}
