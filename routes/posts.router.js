const express = require('express');
const authenticationVerifier = require('../middlewares/authentication-verifier.middleware');
const router = express.Router();
const {
	getAllPostsFromDb,
	createNewPost,
	getUsersWhoLikedThePost,
	likeOrDislikeThePost,
	getAllPostsOfUserFromDb,
} = require('../controllers/posts.controller');
const {
	getViewerDetailsFromDb,
} = require('../middlewares/get-viewer-details-from-db');

router.use(authenticationVerifier);
router.use(getViewerDetailsFromDb);

router.route('/').get(getAllPostsFromDb).post(createNewPost);

router.route('/:userName').get(getAllPostsOfUserFromDb);

router
	.route('/:postId/likedby')
	.get(getUsersWhoLikedThePost)
	.post(likeOrDislikeThePost);

module.exports = router;
