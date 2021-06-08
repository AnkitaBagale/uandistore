const express = require('express');
const router = express.Router();

const {
	getTopThreesQuizzesFromDb,
	createAQuizAndUpdateCategoryInDb,
	getQuizFromDb,
	updateQuizDetails,
} = require('../controllers/quizzes.controller');

router
	.route('/')
	.get(getTopThreesQuizzesFromDb)
	.post(createAQuizAndUpdateCategoryInDb);

router.route('/:quizId').get(getQuizFromDb).post(updateQuizDetails);

module.exports = router;
