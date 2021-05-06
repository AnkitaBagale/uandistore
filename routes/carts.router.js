const express = require('express');
const router = express.Router();
const {
	getUserFromDb,
	getOrCreateCartOfUserFromDb,
	populateCartFromDb,
	addOrUpdateProductInCart,
	updateAddressIdInCart,
} = require('../controllers/carts.controller');

router.param('userid', getUserFromDb);

router.param('userid', getOrCreateCartOfUserFromDb);

router
	.route('/:userid/cart')
	.get(populateCartFromDb)
	.post(addOrUpdateProductInCart);

router.route('/:userid/cart/address').post(updateAddressIdInCart);

module.exports = router;
