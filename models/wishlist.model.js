const mongoose = require('mongoose');
const { Schema } = mongoose;

const WishlistSchema = new Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	products: [
		{
			productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
			active: Boolean,
		},
	],
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = { Wishlist };
