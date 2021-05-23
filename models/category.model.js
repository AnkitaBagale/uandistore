const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
	image: { type: String, require: 'Image of the category is required' },
	name: {
		type: String,
		require: 'Name of the category is required',
		unique: 'category name should be unique',
	},
	featuredColor: {
		type: String,
		require: 'Featured color of the category is required',
	},
	quizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category };
