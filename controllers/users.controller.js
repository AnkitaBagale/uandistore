const { User } = require('../models/user.model');
const { extend } = require('lodash');
const { Note } = require('../models/note.model');
const { Playlist } = require('../models/playlist.model');

const createNewUser = async (req, res) => {
	try {
		const userData = req.body;

		const user = await User.findOne({ email: userData.email });

		if (user) {
			res.status(409).json({
				message:
					'Account already exists for this email, please reset password if forgotten',
			});
			return;
		}

		const NewUser = new User(userData);
		const addedUserDataFromDb = await NewUser.save();

		res.status(201).json({
			response: {
				firstname: addedUserDataFromDb.firstname,
				userId: addedUserDataFromDb._id,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const checkAuthenticationOfUser = async (req, res) => {
	try {
		const email = req.get('email');
		const password = req.get('password');
		const user = await User.findOne({ email });

		if (!user) {
			res.status(401).json({ message: 'email is incorrect!' });
			return;
		} else if (user.password === password) {
			res.status(200).json({
				response: { firstname: user.firstname, userId: user._id },
			});
			return;
		}
		res.status(401).json({ message: 'Password is incorrect!' });
	} catch (error) {
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getUserByEmailFromDb = async (req, res, next, id) => {
	const user = await User.findOne({ email: id });

	if (!user) {
		res.status(404).json({ message: 'email does not exist!' });
		return;
	}
	req.user = user;
	next();
};

const updateUserDetails = async (req, res) => {
	try {
		let { user } = req;

		const userUpdates = req.body;

		user = extend(user, userUpdates);

		user = await user.save();
		res.status(200).json({
			response: {
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				userId: user._id,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getUserByIdFromDb = async (req, res) => {
	try {
		const { userId } = req.params;
		console.log(userId);
		const user = await User.findById({ _id: userId });

		if (!user) {
			res.status(404).json({ message: 'email does not exist!' });
			return;
		}

		res.status(200).json({
			response: {
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				userId: user._id,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getNotesOfVideoOfUserFromDb = async (req, res) => {
	try {
		const { userId, videoId } = req.params;
		const notes = await Note.find({ userId: userId, videoId: videoId });
		res.status(200).json({ response: notes });
	} catch (error) {
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const getOrCreatePlaylistsOfUser = async (req, res) => {
	try {
		const { userId } = req.params;

		let playlists = await Playlist.find({ userId }).populate({
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
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	createNewUser,
	checkAuthenticationOfUser,
	getUserByEmailFromDb,
	updateUserDetails,
	getUserByIdFromDb,
	getNotesOfVideoOfUserFromDb,
	getOrCreatePlaylistsOfUser,
};
