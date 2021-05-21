const { Note } = require('../models/note.model');
const { extend } = require('lodash');

const createNoteForVideo = async (req, res) => {
	try {
		let newNote = req.body;
		newNote = new Note(newNote);
		newNote = await newNote.save();
		res.status(201).json({ response: newNote });
	} catch (error) {
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const getNoteFromDb = async (req, res, next, id) => {
	try {
		const note = await Note.findById(id);
		req.note = note;
		next();
	} catch (error) {
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
		res.status(200).json({ response: note });
	} catch (error) {
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
		res.status(200).json({ response: note });
	} catch (error) {
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

module.exports = { createNoteForVideo, getNoteFromDb, updateNote, deleteNote };
