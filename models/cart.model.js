const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	products: [
		{
			productId: { type: Schema.Types.ObjectId, ref: 'Product' },
			quantity: Number,
			active: Boolean,
		},
	],
	addressId: { type: Schema.Types.ObjectId, ref: 'Address', default: null },
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = { Cart };
