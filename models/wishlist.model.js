const mongoose = require('mongoose');
const { Schema } = mongoose;

const WishlistSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	products: [
		{
			productId: { type: Schema.Types.ObjectId, ref: 'Product' },
			active: Boolean,
		},
	],
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = { Wishlist };
