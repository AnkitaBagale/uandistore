const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
	name: {
		type: String,
		required: 'Product name is required',
	},

	image: {
		type: String,
	},

	price: {
		type: Number,
		required: 'Product price is required',
	},

	category: {
		type: String,
		required: 'Product category is required',
	},

	brand: {
		type: String,
	},

	inStock: {
		type: Boolean,
		required: 'Product is instock information is required',
		default: true,
	},

	fastDelivery: {
		type: Boolean,
		default: false,
	},

	rating: {
		starRating: { type: Number, default: 0 },
		totalReviews: { type: Number, default: 0 },
	},

	offer: {
		type: Number,
		default: 0,
	},

	level: {
		type: String,
	},

	avalQty: {
		type: Number,
		required: 'Available quantity information is required',
	},

	url: {
		type: String,
	},
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product };
