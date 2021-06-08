const express = require('express');
const authenticationVerifier = require('../middlewares/authentication-verifier.middleware');
const router = express.Router();
const {
	getAllPostsFromDb,
	createNewPost,
	getUsersWhoLikedThePost,
	likeOrDislikeThePost,
} = require('../controllers/posts.controller');

router
	.route('/')
	.get(authenticationVerifier, getAllPostsFromDb)
	.post(authenticationVerifier, createNewPost);

router
	.route('/:postId/likedby')
	.get(authenticationVerifier, getUsersWhoLikedThePost)
	.post(authenticationVerifier, likeOrDislikeThePost);

module.exports = router;
