const express = require('express');
const authenticationVerifier = require('../middlewares/authentication-verifier.middleware');
const router = express.Router();

const {
	getAllUsersFromDb,
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
const {
	getViewerDetailsFromDb,
} = require('../middlewares/get-viewer-details-from-db');
const {
	getNotificationsOfUser,
} = require('../controllers/notifications.controller');

router
	.route('/uandi-signup-verification')
	.post(verifyUserInUandIUsersCollection);

router.route('/uandi-signup').post(signUpWithUandI);

router.route('/signup').post(createUserInUandIUsersandSocialProfile);

router.route('/login').post(loginUserInSocialMedia);

router.use(authenticationVerifier);
router.use(getViewerDetailsFromDb);

router.route('/').get(getAllUsersFromDb);
router.route('/notifications').get(getNotificationsOfUser);

router
	.route('/:userName')
	.get(getUserProfileFromDb)
	.post(updateProfileOnSocialMedia);

router
	.route('/:userName/followers')
	.get(getFollowersDetailsOfUserFromDb)
	.post(followOrUnfollowUser);

router
	.route('/:userName/following')
	.get(getFollowingDetailsOfUserFromDb)
	.post(removeUserFromFollowingList);

module.exports = router;
