const { QuizAttempt } = require('../models/quizAttempt.model');

const getAttemptDetailsForQuizOfUser = async (req, res) => {
	try {
		const { quizId } = req.params;
		const userId = req.get('userId');

		const userAttempts = await QuizAttempt.find(
			{ userId, quizId },
			{ score: 1, createdAt: 1 },
		);
		res.status(200).json({ response: userAttempts });
	} catch (error) {
		console.log(error);
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const addAttemptOnQuizOfUser = async (req, res) => {
	try {
		const attemptDetails = req.body;

		const newAttempt = new QuizAttempt(attemptDetails);
		await newAttempt.save();
		newAttempt.__v = undefined;
		newAttempt.updatedAt = undefined;
		newAttempt.userId = undefined;
		newAttempt.quizId = undefined;

		res.json({ response: newAttempt });
	} catch (error) {
		console.log(error);
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

module.exports = { getAttemptDetailsForQuizOfUser, addAttemptOnQuizOfUser };
