const mongoose = require('mongoose');
const { Schema } = mongoose;

const OptionSchema = new Schema({
	text: string,
	isRight: boolean,
});

const QuestionSchema = new Schema({
	question: string,
	image: string,
	points: number,
	negativePoints: number,
	options: [OptionSchema],
});

const UserScoreSchema = {
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	score: Number,
};

const QuizSchema = new Schema({
	name: string,
	image: string,
	totalQuestions: number,
	questions: [QuestionSchema],
	type: string,
	level: string,
	highScore: [UserScoreSchema],
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = { Quiz };
