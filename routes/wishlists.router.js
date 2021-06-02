const express = require('express');
const router = express.Router();

const {
	getOrCreateWishlistFromDb,
	populateWishlistFromDb,
	addOrUpdateProductInWishlist,
} = require('../controllers/wishlists.controller');

router.use(getOrCreateWishlistFromDb);

router
	.route('/')
	.get(populateWishlistFromDb)
	.post(addOrUpdateProductInWishlist);

module.exports = router;
