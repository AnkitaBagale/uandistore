const { Wishlist } = require('../models/wishlist.model');
const { User } = require('../models/user.model');

const getOrCreateWishlistFromDb = async (req, res, next) => {
	try {
		let userId = req.user._id;
		let wishlist = await Wishlist.findOne({ userId });

		if (!wishlist) {
			wishlist = new Wishlist({ userId, products: [] });
			wishlist = await wishlist.save();
		}
		req.wishlist = wishlist;
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const populateWishlistFromDb = async (req, res) => {
	try {
		let { wishlist } = req;
		wishlist = await wishlist
			.populate({
				path: 'products.productId',
				select: 'name price image brand offer inStock url',
			})
			.execPopulate();

		activeProductsInWishlist = wishlist.products.filter((item) => item.active);
		res.status(200).json({ response: activeProductsInWishlist });
	} catch (error) {
		console.error(error);
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const addOrUpdateProductInWishlist = async (req, res) => {
	try {
		const productUpdates = req.body;
		const { wishlist } = req;

		const isProductAlreadyAdded = wishlist.products.find(
			(product) => product.productId == productUpdates._id,
		);

		// if product is already present in the wishlist then toggling the status of product
		if (isProductAlreadyAdded) {
			for (let product of wishlist.products) {
				if (productUpdates._id == product.productId) {
					product.active = !product.active;
				}
			}
		} else {
			wishlist.products.push({ productId: productUpdates._id, active: true });
		}

		let updatedWishlistFromDb = await wishlist.save();
		updatedWishlistFromDb = await updatedWishlistFromDb
			.populate({
				path: 'products.productId',
				select: 'name price image offer inStock url',
			})
			.execPopulate();

		activeProductsInWishlist = updatedWishlistFromDb.products.filter(
			(item) => item.active,
		);

		res.status(200).json({ response: activeProductsInWishlist });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	getOrCreateWishlistFromDb,
	populateWishlistFromDb,
	addOrUpdateProductInWishlist,
};
