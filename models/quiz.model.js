const mongoose = require('mongoose');
const { Schema } = mongoose;

const OptionSchema = new Schema({
	text: String,
	isRight: Boolean,
});

const QuestionSchema = new Schema({
	question: String,
	image: String,
	points: Number,
	negativePoints: Number,
	options: [OptionSchema],
});

const UserScoreSchema = {
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	score: Number,
};

const QuizSchema = new Schema({
	name: String,
	image: String,
	totalQuestions: Number,
	questions: [QuestionSchema],
	type: String,
	level: String,
	highScore: [UserScoreSchema],
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = { Quiz };
