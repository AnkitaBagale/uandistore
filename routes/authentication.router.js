const express = require('express');
const router = express.Router();

const {
	createNewUser,
	checkAuthenticationOfUser,
	updatePassword,
} = require('../controllers/users.controller');

router.route('/').post(createNewUser);
router.route('/authenticate').post(checkAuthenticationOfUser);
router.route('/reset-password').post(updatePassword);

module.exports = router;
