const express = require('express');
const router = express.Router();

const {
	getUserByIdFromDb,
	getOrCreateWishlistFromDb,
	populateWishlistFromDb,
	addOrUpdateProductInWishlist,
} = require('../controllers/wishlists.controller');

router.param('userid', getUserByIdFromDb);

router.param('userid', getOrCreateWishlistFromDb);

router
	.route('/:userid/wishlist')
	.get(populateWishlistFromDb)
	.post(addOrUpdateProductInWishlist);

module.exports = router;
