const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	videoId: { type: String, ref: 'Video' },
	title: { type: String },
	description: { type: String },
	time: { type: String },
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = { Note };
