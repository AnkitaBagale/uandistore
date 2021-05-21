const mongoose = require('mongoose');
const { Schema } = mongoose;

const VideoSchema = new Schema({
	_id: String,
	name: { type: String },
	type: { type: String },
	level: { type: String },
	language: { type: String },
	thumbnail: { type: String },
	tutorId: { type: Schema.Types.ObjectId, ref: 'Tutor' },
});

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
