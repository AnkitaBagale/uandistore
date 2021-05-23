const express = require('express');
const { Category } = require('../models/category.model');
const router = express.Router();

router
	.route('/')
	.get(async (req, res) => {
		try {
			const categories = await Category.find(
				{},
				{ name: 1, image: 1, featuredColor: 1, quizzes: 1 },
			).lean();

			const normalizedData = categories.map((item) => ({
				...item,
				quizzes: item.quizzes.length,
			}));
			res.status(200).json({ response: normalizedData });
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: 'Something went wrong',
				errorMessage: error.message,
			});
		}
	})
	.post(async (req, res) => {
		try {
			const categoryDetails = req.body;

			const newCategory = new Category(categoryDetails);

			await newCategory.save();

			res.status(200).json({ response: newCategory });
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: 'Something went wrong',
				errorMessage: error.message,
			});
		}
	});

router.route('/:categoryId').get(async (req, res) => {
	try {
		const { categoryId } = req.params;
		const category = await Category.findById(categoryId, {
			name: 1,
			quizzes: 1,
		})
			.lean()
			.populate({
				path: 'quizzes',
				select: 'name image category level',
				populate: { path: 'category', select: 'name' },
			});

		if (!category) {
			res
				.status(404)
				.json({ message: 'Category associated with id not found' });
			return;
		}

		const normalizedDataOfQuizzes = category.quizzes.map((item) => ({
			...item,
			category: item.category.name,
		}));
		category.quizzes = normalizedDataOfQuizzes;

		res.status(200).json({ response: category });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
});

module.exports = router;
