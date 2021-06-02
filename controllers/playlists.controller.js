const { Playlist } = require('../models/playlist.model');
const { extend } = require('lodash');

const getOrCreatePlaylistsOfUser = async (req, res) => {
	try {
		const userId = req.user._id;

		let playlists = await Playlist.find({ userId }, { userId: 0 }).populate({
			path: 'videoList.videoId',
			populate: { path: 'tutorId' },
		});

		if (playlists.length === 0) {
			let watchlaterPlaylist = new Playlist({
				userId,
				type: 'watchlater',
				isDefault: true,
				videoList: [],
			});
			let historyPlaylist = new Playlist({
				userId,
				type: 'history',
				isDefault: true,
				videoList: [],
			});
			let likedPlaylist = new Playlist({
				userId,
				type: 'liked',
				isDefault: true,
				videoList: [],
			});
			await Playlist.insertMany([
				watchlaterPlaylist,
				historyPlaylist,
				likedPlaylist,
			]);
			watchlaterPlaylist.userId = undefined;
			historyPlaylist.userId = undefined;
			likedPlaylist.userId = undefined;
			res.status(201).json({
				response: {
					watchlaterPlaylist,
					historyPlaylist,
					likedPlaylist,
					customPlaylist: [],
				},
			});
			return;
		}

		const historyPlaylist = playlists.find((item) => item.type === 'history');
		const likedPlaylist = playlists.find((item) => item.type === 'liked');
		const watchlaterPlaylist = playlists.find(
			(item) => item.type === 'watchlater',
		);
		const customPlaylist = playlists.filter((item) => item.type === 'custom');

		res.status(200).json({
			response: {
				watchlaterPlaylist,
				historyPlaylist,
				likedPlaylist,
				customPlaylist,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const createNewPlaylist = async (req, res) => {
	try {
		let newPlaylist = req.body;
		const userId = req.user._id;
		newPlaylist = new Playlist({ ...newPlaylist, userId });
		newPlaylist = await newPlaylist.save();
		newPlaylist = await newPlaylist
			.populate({ path: 'videoList.videoId', populate: { path: 'tutorId' } })
			.execPopulate();
		newPlaylist.userId = undefined;
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
		const userId = req.user._id;
		const playlist = await Playlist.findOne({ _id: id, userId });

		if (!playlist) {
			res
				.status(404)
				.json({ message: 'Playlist is not associated with the user' });
		}
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
		playlist.userId = undefined;
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
		playlist.userId = undefined;
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
		playlist.userId = undefined;
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
	getOrCreatePlaylistsOfUser,
	createNewPlaylist,
	getPlaylistFromDb,
	updatePlaylist,
	deletePlaylist,
	addOrRemoveVideoFromPlaylist,
};
