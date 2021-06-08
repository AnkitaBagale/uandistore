const express = require('express');
const authenticationVerifier = require('../middlewares/authentication-verifier.middleware');
const router = express.Router();

const {
	verifyUserInUandIUsersCollection,
	signUpWithUandI,
	createUserInUandIUsersandSocialProfile,
	loginUserInSocialMedia,
	getUserProfileFromDb,
	updateProfileOnSocialMedia,
	getFollowersDetailsOfUserFromDb,
	followOrUnfollowUser,
	removeUserFromFollowingList,
	getFollowingDetailsOfUserFromDb,
} = require('../controllers/socialProfiles.controller');

router
	.route('/uandi-signup-verification')
	.post(verifyUserInUandIUsersCollection);

router.route('/uandi-signup').post(signUpWithUandI);

router.route('/signup').post(createUserInUandIUsersandSocialProfile);

router.route('/login').post(loginUserInSocialMedia);

router
	.route('/:userName')
	.get(authenticationVerifier, getUserProfileFromDb)
	.post(authenticationVerifier, updateProfileOnSocialMedia);

router
	.route('/:userName/followers')
	.get(authenticationVerifier, getFollowersDetailsOfUserFromDb)
	.post(authenticationVerifier, followOrUnfollowUser);

router
	.route('/:userName/following')
	.get(authenticationVerifier, getFollowingDetailsOfUserFromDb)
	.post(authenticationVerifier, removeUserFromFollowingList);

module.exports = router;
