const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { extend } = require('lodash');

const { SocialProfile } = require('../models/socialProfile.model');
const { User } = require('../models/user.model');
const {
	getNameFromSocialProfile,
} = require('../utils/get-name-from-social-profile');
const {
	getSocialProfileCleaned,
} = require('../utils/get-social-profile-cleaned');

const JWT_KEY = process.env.JWT_KEY;

const verifyUserInUandIUsersCollection = async (req, res, next) => {
	try {
		const email = req.get('email');
		const password = req.get('password');
		const user = await User.findOne({ email });

		if (!user) {
			res.status(403).json({ message: 'Email or password is incorrect!' });
		} else {
			const isValidPassword = await bcrypt.compare(password, user.password);

			if (isValidPassword) {
				res.status(200).json({
					response: {
						firstname: user.firstname,
						lastname: user.lastname,
						userId: user._id,
					},
				});
			} else {
				res.status(403).json({ message: 'Email or password is incorrect!' });
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const signUpWithUandI = async (req, res) => {
	try {
		const userData = req.body;
		const userNameExists = await SocialProfile.findOne({
			userName: userData.userName,
		});
		if (userNameExists) {
			res.status(409).json({
				message: 'Username not available! Try another username',
			});
			return;
		}
		const newProfile = new SocialProfile(userData);
		await newProfile.save();
		res.status(201).json({ response: 'Account created successfully!' });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const createUserInUandIUsersandSocialProfile = async (req, res) => {
	try {
		const userData = req.body;

		const user = await User.findOne({ email: userData.email });
		if (user) {
			const viewer = await SocialProfile.findOne({ userId: user._id });
			if (viewer) {
				res.status(409).json({ message: 'Account already exists!' });
				return;
			}
			res.status(409).json({
				message: 'Email already exists with U&I, Login with U&I to continue!',
			});
			return;
		}

		const userNameExists = await SocialProfile.findOne({
			userName: userData.userName,
		});

		if (userNameExists) {
			res.status(409).json({
				message: 'Username not available! Try another username',
			});
			return;
		}
		const newUser = new User(userData);
		const salt = await bcrypt.genSalt(10);
		newUser.password = await bcrypt.hash(newUser.password, salt);
		await newUser.save();
		const newProfile = new SocialProfile({ ...userData, userId: newUser._id });
		await newProfile.save();
		res.status(201).json({ response: 'Account created successfully!' });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const loginUserInSocialMedia = async (req, res) => {
	try {
		const email = req.get('email');
		const password = req.get('password');
		const user = await User.findOne({ email });

		if (!user) {
			res.status(403).json({ message: 'Email or password is incorrect!' });
			return;
		}
		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			res.status(403).json({ message: 'Email or password is incorrect!' });
			return;
		}

		const socialProfile = await SocialProfile.findOne({ userId: user._id });

		if (!socialProfile) {
			res
				.status(403)
				.json({ message: 'User does not exists! Please Sign up!' });
			return;
		}

		const token = jwt.sign({ userId: user._id }, JWT_KEY, {
			expiresIn: '24h',
		});

		res.status(200).json({
			response: {
				name: user.firstname + ' ' + user.lastname,
				token,
				userId: socialProfile._id,
				userName: socialProfile.userName,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong!',
			errorMessage: error.message,
		});
	}
};

const getAllUsersFromDb = async (req, res) => {
	try {
		let users = await SocialProfile.find({}, { userName: 1, userId: 1 })
			.lean()
			.populate({
				path: 'userId',
				select: 'firstname lastname',
			});
		for (let user of users) {
			user = getNameFromSocialProfile(user);
		}
		res.status(200).json({ response: users });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getUserProfileFromDb = async (req, res) => {
	try {
		const userId = req.user._id;
		const viewer = await SocialProfile.findOne({ userId });

		const { userName } = req.params;
		let userDetails = await SocialProfile.findOne({ userName }).populate({
			path: 'userId',
			select: 'firstname lastname',
		});
		//normalizing data

		if (!userDetails || !viewer) {
			res.status(403).json({ message: 'Invalid user id' });
			return;
		}

		userDetails = getSocialProfileCleaned(userDetails, viewer._id);
		res.status(200).json({ response: userDetails });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const updateProfileOnSocialMedia = async (req, res) => {
	try {
		const userId = req.user._id;
		const { userName } = req.params;
		console.log({ userName });
		let userDetails = await SocialProfile.findOne({ userName });

		if (userId.toString() !== userDetails.userId.toString()) {
			res.status(403).json({ message: 'Invalid request' });
			return;
		}
		const userDetailsUpdates = req.body;
		userDetails = extend(userDetails, userDetailsUpdates);

		await userDetails.save();

		userDetails = getSocialProfileCleaned(userDetails, userDetails._id);

		res
			.status(200)
			.json({ response: { bio: userDetails.bio, link: userDetails.link } });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getFollowersDetailsOfUserFromDb = async (req, res) => {
	try {
		const { userName } = req.params;
		let userDetails = await SocialProfile.findOne({ userName }).populate({
			path: 'followers',
			select: 'userName',
		});
		if (!userDetails) {
			res.status(404).json({ message: 'No user found' });
			return;
		}
		res.status(200).json({ response: userDetails.followers });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const followOrUnfollowUser = async (req, res) => {
	try {
		const userId = req.user._id;

		const { userName } = req.params;
		let userDetails = await SocialProfile.findOne({ userName });
		let viewer = await SocialProfile.findOne({ userId });
		if (
			!userDetails ||
			!viewer ||
			userDetails._id.toString() === viewer._id.toString()
		) {
			res.status(400).json({ message: 'Invalid request' });
			return;
		}

		if (viewer.following.includes(userDetails._id)) {
			viewer.following = viewer.following.filter(
				(id) => id.toString() !== userDetails._id.toString(),
			);
			userDetails.followers = userDetails.followers.filter(
				(id) => id.toString() !== viewer._id.toString(),
			);
		} else {
			viewer.following.push(userDetails._id);
			userDetails.followers.push(viewer._id);
		}

		await viewer.save();
		await userDetails.save();
		res.status(200).json({ response: 'Operation Successful!' });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getFollowingDetailsOfUserFromDb = async (req, res) => {
	try {
		const { userName } = req.params;
		let userDetails = await SocialProfile.findOne({ userName }).populate({
			path: 'following',
			select: 'userName',
		});
		if (!userDetails) {
			res.status(404).json({ message: 'No user found' });
			return;
		}
		res.status(200).json({ response: userDetails.following });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const removeUserFromFollowingList = async (req, res) => {
	try {
		const userId = req.user._id;
		const { userName } = req.params;

		let userDetails = await SocialProfile.findOne({ userName });
		let viewer = await SocialProfile.findOne({ userId });

		if (
			!userDetails ||
			!viewer ||
			userDetails._id.toString() === viewer._id.toString()
		) {
			res.status(400).json({ message: 'Invalid request' });
			return;
		}

		if (viewer.followers.includes(userDetails._id)) {
			viewer.followers = viewer.followers.filter(
				(id) => id.toString() !== userDetails._id.toString(),
			);
			userDetails.following = userDetails.following.filter(
				(id) => id.toString() !== viewer._id.toString(),
			);
		} else {
			res.status(400).json({ message: 'Invalid request' });
			return;
		}

		await viewer.save();
		await userDetails.save();

		res.status(200).json({ response: 'Operation Successful!' });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};
module.exports = {
	verifyUserInUandIUsersCollection,
	signUpWithUandI,
	createUserInUandIUsersandSocialProfile,
	loginUserInSocialMedia,
	getAllUsersFromDb,
	getUserProfileFromDb,
	updateProfileOnSocialMedia,
	getFollowersDetailsOfUserFromDb,
	followOrUnfollowUser,
	getFollowingDetailsOfUserFromDb,
	removeUserFromFollowingList,
};