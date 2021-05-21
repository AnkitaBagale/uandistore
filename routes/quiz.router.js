const express = require('express');
const { Quiz } = require('../models/quiz.model');
const router = express.Router();

router.route('/').get(async (req, res) => {
	try {
		const quizzes = await Quiz.find({});
		res.status(200).json({ response: quizzes });
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
});
