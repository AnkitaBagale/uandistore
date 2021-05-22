const Video = require('../models/video.model');
const { extend } = require('lodash');

const getAllVideosFromDb = async (req, res) => {
	try {
		const videos = await Video.find({}).populate('tutorId');
		res.status(200).json({ response: videos });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const createOrUpdateVideo = async (req, res) => {
	try {
		const videoDetails = req.body;
		let videoIfExists = await Video.findById(videoDetails._id);
		if (videoIfExists) {
			videoIfExists = extend(videoIfExists, videoDetails);
			videoIfExists = await videoIfExists.save();
			res.status(200).json({ response: videoIfExists });
		} else {
			let NewVideo = new Video(videoDetails);
			NewVideo = await NewVideo.save();
			res.status(201).json({ response: NewVideo });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const getVideoByIdFromDb = async (req, res) => {
	try {
		const { videoId } = req.params;
		const video = await Video.findById(videoId).populate('tutorId');
		if (video) {
			res.status(200).json({ response: video });
			return;
		}
		res.status(404).json({ message: 'video associated with id not found' });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const getVideosOfType = async (req, res) => {
	try {
		const { typeOfVideo } = req.params;

		let videos = await Video.find({ type: typeOfVideo }).limit(3);

		const noOfVideosFetched = videos.length;

		if (noOfVideosFetched < 3) {
			const moreVideos = await Video.find({}).limit(3 - noOfVideosFetched);
			videos = videos.concat(moreVideos);
		}

		res.status(200).send({ response: videos });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	getAllVideosFromDb,
	createOrUpdateVideo,
	getVideoByIdFromDb,
	getVideosOfType,
};
