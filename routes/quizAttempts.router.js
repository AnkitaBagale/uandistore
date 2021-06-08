const express = require('express');
const router = express.Router();

const {
	getAttemptDetailsForQuizOfUser,
	addAttemptOnQuizOfUser,
} = require('../controllers/quizAttempts.controller');

router
	.route('/:quizId')
	.get(getAttemptDetailsForQuizOfUser)
	.post(addAttemptOnQuizOfUser);

module.exports = router;
