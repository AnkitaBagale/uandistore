const { Cart } = require('../models/cart.model');
const { User } = require('../models/user.model');
const { extend } = require('lodash');

const getUserFromDb = async (req, res, next, id) => {
	try {
		const user = await User.findById({ _id: id });

		if (!user) {
			res.status(404).json({
				message: 'No user found associated, please check the user id!',
			});
			return;
		}
		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getOrCreateCartOfUserFromDb = async (req, res, next, id) => {
	try {
		let cart = await Cart.findOne({ userId: id });

		if (!cart) {
			cart = new Cart({ userId: id, products: [] });
			cart = await cart.save();
		}
		req.cart = cart;
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const populateCartFromDb = async (req, res) => {
	try {
		let { cart } = req;
		cart = await cart
			.populate({
				path: 'products.productId',
				select: 'name price image offer inStock url',
			})
			.execPopulate();

		activeProductsInCart = cart.products.filter((item) => item.active);

		res.status(200).json({
			response: {
				products: activeProductsInCart,
				addressId: cart.addressId,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const addOrUpdateProductInCart = async (req, res) => {
	try {
		const productUpdates = req.body;
		const { cart } = req;

		const isProductAlreadyAdded = cart.products.find(
			(product) => product.productId == productUpdates._id,
		);

		// if product is already present in the wishlist then updating that particular product
		if (isProductAlreadyAdded) {
			for (let product of cart.products) {
				if (productUpdates._id == product.productId) {
					product = extend(product, productUpdates);
				}
			}
		} else {
			cart.products.push({
				productId: productUpdates._id,
				quantity: 1,
				active: true,
			});
		}
		let updatedCartFromDb = await cart.save();
		updatedCartFromDb = await updatedCartFromDb
			.populate({
				path: 'products.productId',
				select: 'name price image offer inStock url',
			})
			.execPopulate();

		activeProductsInCart = updatedCartFromDb.products.filter(
			(item) => item.active,
		);

		res.status(200).json({
			response: {
				products: activeProductsInCart,
				addressId: cart.addressId,
			},
		});
	} catch (error) {
		console.error(error);
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const updateAddressIdInCart = async (req, res) => {
	try {
		addressId = req.body;
		let { cart } = req;
		cart.addressId = addressId._id;

		cart = await cart.save();

		cart = await cart
			.populate({
				path: 'products.productId',
				select: 'name price image offer inStock url',
			})
			.execPopulate();

		const activeProductsInCart = cart.products.filter((item) => item.active);
		res.status(200).json({
			response: {
				products: activeProductsInCart,
				addressId: cart.addressId,
			},
		});
	} catch (error) {
		console.error(error);
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	getUserFromDb,
	getOrCreateCartOfUserFromDb,
	populateCartFromDb,
	addOrUpdateProductInCart,
	updateAddressIdInCart,
};
