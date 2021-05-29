const { Note } = require('../models/note.model');
const { extend } = require('lodash');

const getNotesOfVideoOfUserFromDb = async (req, res) => {
	try {
		const { videoId } = req.params;
		const userId = req.user._id;
		const notes = await Note.find(
			{ userId, videoId },
			{ title: 1, description: 1, videoId: 1, time: 1 },
		);
		res.status(200).json({ response: notes });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const createNoteForVideo = async (req, res) => {
	try {
		let newNote = req.body;
		const userId = req.user._id;
		newNote = new Note({ ...newNote, userId });

		newNote = await newNote.save();
		newNote.userId = undefined;

		res.status(201).json({ response: newNote });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const getNoteFromDb = async (req, res, next, id) => {
	try {
		const userId = req.user._id;
		const note = await Note.findOne(
			{ _id: id, userId },
			{ title: 1, description: 1, videoId: 1, time: 1 },
		);

		if (!note) {
			res.status(404).json({ message: 'Note is not associated with the user' });
			return;
		}

		req.note = note;
		next();
	} catch (error) {
		console.error(error);
		res.status(404).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const updateNote = async (req, res) => {
	try {
		const noteUpdates = req.body;
		let { note } = req;
		note = extend(note, noteUpdates);
		note = await note.save();
		note.userId = undefined;
		res.status(200).json({ response: note });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const deleteNote = async (req, res) => {
	try {
		let { note } = req;
		note = await note.remove();
		note.userId = undefined;
		res.status(200).json({ response: note });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	createNoteForVideo,
	getNoteFromDb,
	updateNote,
	deleteNote,
	getNotesOfVideoOfUserFromDb,
};
