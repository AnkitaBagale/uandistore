const express = require('express');
const router = express.Router();

const {
	getAllVideosFromDb,
	createOrUpdateVideo,
	getVideoByIdFromDb,
} = require('../controllers/videos.controller');

router.route('/').get(getAllVideosFromDb).post(createOrUpdateVideo);

router.route('/:videoId').get(getVideoByIdFromDb);

module.exports = router;
