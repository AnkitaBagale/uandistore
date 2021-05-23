const express = require('express');
const { Category } = require('../models/category.model');
const { Quiz } = require('../models/quiz.model');
const router = express.Router();
const { extend } = require('lodash');

router
	.route('/')
	.get(async (req, res) => {
		try {
			const quizzes = await Quiz.find(
				{},
				{ image: 1, name: 1, category: 1, level: 1 },
			)
				.limit(3)
				.lean()
				.populate({ path: 'category', select: 'name' });

			console.log(quizzes);

			const normalizedData = quizzes.map((item) => ({
				...item,
				category: item.category.name,
			}));
			res.status(200).json({ response: normalizedData });
		} catch (error) {
			console.log(error);
			res.json({
				message:
					'Request failed please check errorMessage key for more details',
				errorMessage: error.message,
			});
		}
	})
	.post(async (req, res) => {
		try {
			const quizDetails = req.body;

			const categoryId = quizDetails.category;
			const categoryDocument = await Category.findById(categoryId);

			if (!categoryDocument) {
				return res.status(400).json({ message: 'category is invalid' });
			}

			let newQuiz = new Quiz(quizDetails);
			newQuiz = await newQuiz.save();

			//update quiz id in category document
			categoryDocument.quizzes.push(newQuiz._id);
			await categoryDocument.save();

			res.status(200).json({ response: newQuiz });
		} catch (error) {
			console.log(error);
			res.json({
				message:
					'Request failed please check errorMessage key for more details',
				errorMessage: error.message,
			});
		}
	});

router
	.route('/:quizId')
	.get(async (req, res) => {
		try {
			const { quizId } = req.params;
			const quiz = await Quiz.findById(quizId, {
				name: 1,
				questions: 1,
				totalQuestions: 1,
				highScore: 1,
				category: 1,
				level: 1,
			})
				.lean()
				.populate({ path: 'highScore.userId', select: 'firstname lastname' })
				.populate({ path: 'category', select: 'name' });

			if (!quiz) {
				return res
					.status(404)
					.json({ message: 'Quiz associated with this id not found' });
			}

			const normalizedData = {
				...quiz,
				category: quiz.category.name,
				highScore: quiz.highScore.map((item) => ({
					...item,
					userId: item.userId.firstname + ' ' + item.userId.lastname,
				})),
			};
			res.status(200).json({ response: normalizedData });
		} catch (error) {
			console.log(error);
			res.json({
				message:
					'Request failed please check errorMessage key for more details',
				errorMessage: error.message,
			});
		}
	})
	.post(async (req, res) => {
		try {
			const { quizId } = req.params;
			const quizUpdates = req.body;
			let quiz = await Quiz.findById(quizId);
			if (!quiz) {
				return res
					.status(404)
					.json({ message: 'Quiz associated with this id not found' });
			}

			quiz = extend(quiz, quizUpdates);
			await quiz.save();
			res.status(200).json({ response: quiz });
		} catch (error) {
			console.log(error);
			res.json({
				message:
					'Request failed please check errorMessage key for more details',
				errorMessage: error.message,
			});
		}
	});

module.exports = router;
