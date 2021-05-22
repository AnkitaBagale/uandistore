const { Playlist } = require('../models/playlist.model');
const { extend } = require('lodash');

const createNewPlaylist = async (req, res) => {
	try {
		let newPlaylist = req.body;
		newPlaylist = new Playlist(newPlaylist);
		newPlaylist = await newPlaylist.save();
		newPlaylist = await newPlaylist
			.populate({ path: 'videoList.videoId', populate: { path: 'tutorId' } })
			.execPopulate();

		res.status(201).json({ response: newPlaylist });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const getPlaylistFromDb = async (req, res, next, id) => {
	try {
		const playlist = await Playlist.findById(id);
		req.playlist = playlist;
		next();
	} catch (error) {
		console.error(error);
		res.status(404).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const updatePlaylist = async (req, res) => {
	try {
		let { playlist } = req;
		const playlistUpdates = req.body;
		playlist = extend(playlist, playlistUpdates);
		playlist = await playlist.save();
		playlist = await playlist
			.populate({ path: 'videoList.videoId', populate: { path: 'tutorId' } })
			.execPopulate();
		res.status(200).json({ response: playlist });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const deletePlaylist = async (req, res) => {
	try {
		let { playlist } = req;
		if (playlist.isDefault) {
			throw new Error('Cannot delete default playlist');
		}
		await playlist.remove();
		res.status(200).json({ response: playlist });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const addOrRemoveVideoFromPlaylist = async (req, res) => {
	try {
		let { playlist } = req;
		const videoUpdates = req.body;

		const isVideoAlreadyAdded = playlist.videoList.find(
			(video) => video.videoId == videoUpdates.videoId,
		);

		if (isVideoAlreadyAdded) {
			let newVideoList = playlist.videoList.filter(
				(video) => video.videoId !== videoUpdates.videoId,
			);
			playlist.videoList = newVideoList;
		} else {
			playlist.videoList.push(videoUpdates);
		}

		playlist = await playlist.save();
		playlist = await playlist
			.populate({ path: 'videoList.videoId', populate: { path: 'tutorId' } })
			.execPopulate();
		res.status(201).json({ response: playlist });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	createNewPlaylist,
	getPlaylistFromDb,
	updatePlaylist,
	deletePlaylist,
	addOrRemoveVideoFromPlaylist,
};
