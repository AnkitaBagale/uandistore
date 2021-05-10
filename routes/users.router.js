const express = require('express');
const router = express.Router();

const {
	createNewUser,
	checkAuthenticationOfUser,
	getUserByEmailFromDb,
	updateUserDetails,
} = require('../controllers/users.controller');

router.route('/').post(createNewUser);

router.route('/authenticate').post(checkAuthenticationOfUser);

router.param('email', getUserByEmailFromDb);

router.route('/:email').post(updateUserDetails);

module.exports = router;
