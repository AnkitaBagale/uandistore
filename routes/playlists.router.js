const express = require('express');
const router = express.Router();

const {
	createNewPlaylist,
	getPlaylistFromDb,
	updatePlaylist,
	deletePlaylist,
	addOrRemoveVideoFromPlaylist,
} = require('../controllers/playlists.controller');

router.route('/').post(createNewPlaylist);

router.param('playlistId', getPlaylistFromDb);
router.route('/:playlistId').post(updatePlaylist).delete(deletePlaylist);

router.route('/:playlistId/videos').post(addOrRemoveVideoFromPlaylist);

module.exports = router;
