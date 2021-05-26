const express = require('express');
const router = express.Router();

const {
	getUserByIdFromDb,
	getOrCreateWishlistFromDb,
	populateWishlistFromDb,
	addOrUpdateProductInWishlist,
} = require('../controllers/wishlists.controller');

router.param('userId', getUserByIdFromDb);

router.param('userId', getOrCreateWishlistFromDb);

router
	.route('/:userId/wishlist')
	.get(populateWishlistFromDb)
	.post(addOrUpdateProductInWishlist);

module.exports = router;
