const { User } = require('../models/user.model');
const { Note } = require('../models/note.model');
const { Playlist } = require('../models/playlist.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_KEY = process.env.JWT_KEY;

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
		const salt = await bcrypt.genSalt(10);
		NewUser.password = await bcrypt.hash(NewUser.password, salt);
		await NewUser.save();

		res.status(201).json({ message: 'User is signed up!' });
	} catch (error) {
		console.error(error);
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
		} else {
			const isValidPassword = await bcrypt.compare(password, user.password);

			if (isValidPassword) {
				const token = jwt.sign({ userId: user._id }, JWT_KEY, {
					expiresIn: '24h',
				});
				res.status(200).json({
					response: { firstname: user.firstname, userId: user._id, token },
				});
			} else {
				res.status(401).json({ message: 'Password is incorrect!' });
			}
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const updatePassword = async (req, res) => {
	try {
		const user = req.body;
		let userFromDb = await User.findOne({ email: user.email });

		if (!userFromDb) {
			res.status(401).json({ message: 'User does not exist' });
		}

		const salt = await bcrypt.genSalt(10);
		userFromDb.password = await bcrypt.hash(user.password, salt);

		userFromDb = await userFromDb.save();

		res.status(200).json({
			message: 'User details updated!',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getUserDetailsFromDb = async (req, res) => {
	try {
		const { user } = req;

		res.status(200).json({
			response: {
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
			},
		});
	} catch (error) {
		console.error(error);
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
		console.error(error);
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
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	createNewUser,
	checkAuthenticationOfUser,
	getUserDetailsFromDb,
	updatePassword,
	getNotesOfVideoOfUserFromDb,
	getOrCreatePlaylistsOfUser,
};
