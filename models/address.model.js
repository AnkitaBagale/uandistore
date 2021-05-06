const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	name: String,
	streetAddress: String,
	city: String,
	state: String,
	country: String,
	zipCode: String,
	phoneNumber: String,
});

const Address = mongoose.model('Address', AddressSchema);

module.exports = { Address };
