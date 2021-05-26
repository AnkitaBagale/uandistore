const express = require('express');
const router = express.Router();
const {
	getUserFromDb,
	getOrCreateCartOfUserFromDb,
	populateCartFromDb,
	addOrUpdateProductInCart,
	updateAddressIdInCart,
} = require('../controllers/carts.controller');

router.param('userId', getUserFromDb);

router.param('userId', getOrCreateCartOfUserFromDb);

router
	.route('/:userId/cart')
	.get(populateCartFromDb)
	.post(addOrUpdateProductInCart);

router.route('/:userId/cart/address').post(updateAddressIdInCart);

module.exports = router;
