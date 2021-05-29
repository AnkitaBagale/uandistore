const express = require('express');
const router = express.Router();

const {
	updatePassword,
	getUserDetailsFromDb,
} = require('../controllers/users.controller');

router.route('/self').post(updatePassword);

router.route('/self').get(getUserDetailsFromDb);

module.exports = router;
