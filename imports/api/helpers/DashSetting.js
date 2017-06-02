import { Mongo } from 'meteor/mongo';
import { Class, Union } from 'meteor/jagi:astronomy';

export const DashSettings = new Mongo.Collection('dashSettings');

const DashSetting = Class.create({
	name: 'Dash Setting',
	collection: DashSettings,
	fields: {
		name: String,
		value: Union.create({name: 'Setting Type', types: [String, Number, Object, Array, Boolean]})
	},
});

if(Meteor.isServer) {
	DashSetting.extend({
		meteorMethods: {
			'/dashsettings/create' (dashSetting) {
				dashSetting.save(error => {
					if(error) throw new Meteor.Error(error);
				});
			}
		}
	});
	Meteor.publish('/dashsettings', () => DashSetting.find());
}

export default DashSetting;
