const express = require('express');
const router = express.Router();

const {
	updatePassword,
	getUserDetailsFromDb,
	getNotesOfVideoOfUserFromDb,
	getOrCreatePlaylistsOfUser,
} = require('../controllers/users.controller');

router.route('/self').post(updatePassword);

router.route('/self').get(getUserDetailsFromDb);

router.route('/:userId/notes/:videoId').get(getNotesOfVideoOfUserFromDb);

router.route('/:userId/playlists').get(getOrCreatePlaylistsOfUser);

module.exports = router;
