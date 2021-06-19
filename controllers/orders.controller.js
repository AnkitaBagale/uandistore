const { Cart } = require('../models/cart.model');
const { Order } = require('../models/order.model');

const getOrderDetails = async (req, res) => {
	try {
		const userId = req.user._id;
		const orders = await Order.find({ userId })
			.lean()
			.populate({ path: 'items.productId', select: 'image brand name' })
			.populate({ path: 'addressId' });

		res.status(200).json({ response: orders });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const createNewOrder = async (req, res) => {
	try {
		const userId = req.user._id;
		const orderDetails = req.body;
		const newOrder = new Order({ ...orderDetails, userId });
		await newOrder.save();
		const cart = await Cart.findOne({ userId });
		cart.products = cart.products.filter((item) =>
			orderDetails.items.find(
				(order) => order.productId.toString() !== item.productId.toString(),
			),
		);
		await cart.save();

		res.status(201).json({ response: newOrder._id });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

module.exports = { getOrderDetails, createNewOrder };
