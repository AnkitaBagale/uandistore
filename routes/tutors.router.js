const express = require('express');
const router = express.Router();
const {
	getAllTutorsFromDb,
	createNewTutor,
} = require('../controllers/tutors.controller');

router.route('/').get(getAllTutorsFromDb).post(createNewTutor);

module.exports = router;
