const mongoose = require('mongoose');
const { Schema } = mongoose;

const TutorSchema = new Schema({
	name: { type: String, required: 'Tutor name is required' },
	avatar: { type: String },
});

const Tutor = mongoose.model('Tutor', TutorSchema);

module.exports = { Tutor };
