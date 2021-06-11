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

router
	.route('/')
	.get(authenticationVerifier, getAllPostsFromDb)
	.post(authenticationVerifier, createNewPost);

router.route('/:userName').get(authenticationVerifier, getAllPostsOfUserFromDb);

router
	.route('/:postId/likedby')
	.get(authenticationVerifier, getUsersWhoLikedThePost)
	.post(authenticationVerifier, likeOrDislikeThePost);

module.exports = router;
