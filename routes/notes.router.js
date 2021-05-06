const express = require('express');
const router = express.Router();

const {
	createNoteForVideo,
	getNoteFromDb,
	updateNote,
	deleteNote,
} = require('../controllers/notes.controller');

router.route('/').post(createNoteForVideo);

router.param('noteId', getNoteFromDb);

router.route('/:noteId').post(updateNote).delete(deleteNote);

module.exports = router;
