const express = require('express');
const router = express.Router();

const {
	createNewUser,
	checkAuthenticationOfUser,
} = require('../controllers/users.controller');

router.route('/').post(createNewUser);

router.route('/authenticate').post(checkAuthenticationOfUser);

module.exports = router;
