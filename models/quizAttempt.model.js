const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuizAttemptSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: 'userId is required',
		},
		quizId: {
			type: Schema.Types.ObjectId,
			ref: 'Quiz',
			required: 'quizId is required',
		},
		score: { type: Number, default: 0 },
		createdAt: { type: String },
	},
	{ timestamps: { currentTime: () => new Date().toDateString() } },
);

const QuizAttempt = mongoose.model('QuizAttempt', QuizAttemptSchema);

module.exports = { QuizAttempt };
