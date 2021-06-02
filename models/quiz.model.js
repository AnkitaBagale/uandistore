const mongoose = require('mongoose');
const { Schema } = mongoose;

const OptionSchema = new Schema({
	text: { type: String, required: 'Text for option is required' },
	isRight: {
		type: Boolean,
		required: 'isRight should be true if option is right, otherwise false',
	},
});

const QuestionSchema = new Schema({
	question: { type: String, required: 'Question is required' },
	image: {
		type: String,
		required: 'Reference image for the question is required',
	},
	points: { type: Number, required: 'Points for the question is required' },
	negativePoints: { type: Number, default: 0 },
	options: [OptionSchema],
});

const UserScoreSchema = {
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: 'userId is required',
	},
	score: { type: Number, required: 'score of the highscorer user is required' },
};

const QuizSchema = new Schema({
	name: { type: String, required: 'Name of the Quiz is required' },
	image: { type: String, required: 'Image of the Quiz is required' },
	totalQuestions: {
		type: Number,
		required: 'Number of questions in the Quiz is required',
	},
	questions: [QuestionSchema],
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: 'Category id of the Quiz is required',
	},
	level: { type: String, required: 'Level of the Quiz  is required' },
	highScore: [UserScoreSchema],
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = { Quiz };
