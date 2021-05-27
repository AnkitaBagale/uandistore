const express = require('express');
const router = express.Router();
const {
	getOrCreateCartOfUserFromDb,
	populateCartFromDb,
	addOrUpdateProductInCart,
	updateAddressIdInCart,
} = require('../controllers/carts.controller');

router.param('userId', getOrCreateCartOfUserFromDb);

router.route('/').get(populateCartFromDb).post(addOrUpdateProductInCart);

router.route('/address').post(updateAddressIdInCart);

module.exports = router;
