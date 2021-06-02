const { Product } = require('../models/product.model');

const getAllProductsFromDb = async (req, res) => {
	try {
		const products = await Product.find({});

		res.status(200).json({ response: products });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const createNewProduct = async (req, res) => {
	try {
		const productData = req.body;
		const NewProduct = new Product(productData);
		const addedProductFromDb = await NewProduct.save();
		res.status(201).json({ response: addedProductFromDb });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getProductByIdFromDb = async (req, res) => {
	try {
		const productId = req.params;

		const product = await Product.findById({ _id: productId.id });
		if (product) {
			res.status(200).json({ response: product });
		} else {
			res.status(404).json({ message: 'No product found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	getAllProductsFromDb,
	createNewProduct,
	getProductByIdFromDb,
};
