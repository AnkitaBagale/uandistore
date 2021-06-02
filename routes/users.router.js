const express = require('express');
const router = express.Router();
const authenticationVerifier = require('../middlewares/authentication-verifier.middleware');

const {
	createNewUser,
	checkAuthenticationOfUser,
	updatePassword,
	getUserDetailsFromDb,
} = require('../controllers/users.controller');

router.route('/').post(createNewUser);
router.route('/authenticate').post(checkAuthenticationOfUser);
router.route('/reset-password').post(updatePassword);
router.route('/self').get(authenticationVerifier, getUserDetailsFromDb);

module.exports = router;
