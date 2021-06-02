const express = require('express');
const router = express.Router();

const {
	getAllVideosFromDb,
	createOrUpdateVideo,
	getVideoByIdFromDb,
	getVideosOfType,
} = require('../controllers/videos.controller');

router.route('/').get(getAllVideosFromDb).post(createOrUpdateVideo);

router.route('/:videoId').get(getVideoByIdFromDb);

router.route('/type/:typeOfVideo').get(getVideosOfType);

module.exports = router;
