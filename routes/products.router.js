const express = require('express');
const router = express.Router();

const {
	getAllProductsFromDb,
	createNewProduct,
	getProductByIdFromDb,
} = require('../controllers/products.controller');

router.route('/').get(getAllProductsFromDb).post(createNewProduct);

router.route('/:id').get(getProductByIdFromDb);

module.exports = router;
