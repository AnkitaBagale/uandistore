const express = require('express');
const router = express.Router();

const {
	createNewUser,
	checkAuthenticationOfUser,
	getUserByEmailFromDb,
	updateUserDetails,
	getUserByIdFromDb,
	getNotesOfVideoOfUserFromDb,
	getOrCreatePlaylistsOfUser,
} = require('../controllers/users.controller');

router.route('/').post(createNewUser);

router.route('/authenticate').post(checkAuthenticationOfUser);

router.param('email', getUserByEmailFromDb);

router.route('/:email').post(updateUserDetails);

router.route('/:userId').get(getUserByIdFromDb);

router.route('/:userId/notes/:videoId').get(getNotesOfVideoOfUserFromDb);

router.route('/:userId/playlists').get(getOrCreatePlaylistsOfUser);

module.exports = router;
