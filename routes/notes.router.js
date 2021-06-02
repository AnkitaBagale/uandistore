const express = require('express');
const router = express.Router();

const {
	getNotesOfVideoOfUserFromDb,
	createNoteForVideo,
	getNoteFromDb,
	updateNote,
	deleteNote,
} = require('../controllers/notes.controller');

router.route('/video/:videoId').get(getNotesOfVideoOfUserFromDb);
router.route('/').post(createNoteForVideo);

router.param('noteId', getNoteFromDb);
router.route('/:noteId').post(updateNote).delete(deleteNote);

module.exports = router;
