const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttemptedOptionSchema = new Schema({
	text: String,
	isRight: Boolean,
	isSelected: Boolean,
});

const QuestionSchema = new Schema({
	question: String,
	image: String,
	points: Number,
	negativePoints: Number,
	options: [AttemptedOptionSchema],
});

const AttemptedQuizSchema = new Schema({
	name: String,
	image: String,
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	score: Number,
	totalQuestions: Number,
	questions: [QuestionSchema],
	type: String,
	level: String,
});

const AttemptedQuiz = mongoose.model('AttemptedQuiz', AttemptedQuizSchema);

module.exports = { Quiz };
