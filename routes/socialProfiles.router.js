const express = require('express');
const { SocialProfile } = require('../models/socialProfile.model');
const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');
const authenticationVerifier = require('../middlewares/authentication-verifier.middleware');
const { extend } = require('lodash');
const router = express.Router();
const {
	getSocialProfileCleaned,
} = require('../utils/get-social-profile-cleaned');

router.route('/uandi-signup-verification').post(async (req, res, next) => {
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
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
});

router.route('/uandi-signup').post(async (req, res) => {
	try {
		const userData = req.body;
		const userNameExists = await SocialProfile.findOne({
			userName: userData.userName,
		});
		if (userNameExists) {
			res.status(409).json({
				message: 'Username not available!',
			});
			return;
		}
		const newProfile = new SocialProfile(userData);
		await newProfile.save();
		res.status(201).json({ message: 'Account created successfully!' });
	} catch (error) {
		console.log(error);
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
});

router.route('/signup').post(async (req, res) => {
	try {
		const userData = req.body;

		const user = await User.findOne({ email: userData.email });
		if (user) {
			res.status(403).json({ message: 'Email already exists!' });
			return;
		}
		const userNameExists = await SocialProfile.findOne({
			userName: userData.userName,
		});

		if (userNameExists) {
			res.status(409).json({
				message: 'Username not available!',
			});
			return;
		}
		const newUser = new User(userData);
		const salt = await bcrypt.genSalt(10);
		newUser.password = await bcrypt.hash(newUser.password, salt);
		await newUser.save();
		const newProfile = new SocialProfile({ ...userData, userId: newUser._id });
		await newProfile.save();
		res.status(201).json({ message: 'Account created successfully!' });
	} catch (error) {
		console.log(error);
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
});

router
	.route('/:userName')
	.get(authenticationVerifier, async (req, res) => {
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
			console.log({ userDetails });
			userDetails = getSocialProfileCleaned(userDetails, viewer._id);
			res.json({ response: userDetails });
		} catch (error) {
			console.log(error);
			res.json({
				message:
					'Request failed please check errorMessage key for more details',
				errorMessage: error.message,
			});
		}
	})
	.post(authenticationVerifier, async (req, res) => {
		try {
			const userId = req.user._id;

			const { userName } = req.params;
			let userDetails = await SocialProfile.findOne({ userName });

			if (userId.toString() !== userDetails.userId.toString()) {
				res.status(403).json({ message: 'Invalid request' });
				return;
			}
			const userDetailsUpdates = req.body;
			userDetails = extend(userDetails, userDetailsUpdates);

			await userDetails.save();
			await userDetails
				.populate({
					path: 'userId',
					select: 'firstname lastname',
				})
				.execPopulate();

			userDetails = getSocialProfileCleaned(userDetails, userDetails._id);

			res.status(200).json({ response: userDetails });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message:
					'Request failed please check errorMessage key for more details',
				errorMessage: error.message,
			});
		}
	});

router
	.route('/:userName/followers')
	.get(authenticationVerifier, async (req, res) => {
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
				message:
					'Request failed please check errorMessage key for more details',
				errorMessage: error.message,
			});
		}
	})
	.post(authenticationVerifier, async (req, res) => {
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

			res.status(200).json({ message: 'Operation Successful!' });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message:
					'Request failed please check errorMessage key for more details',
				errorMessage: error.message,
			});
		}
	});

router
	.route('/:userName/following')
	.get(authenticationVerifier, async (req, res) => {
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
				message:
					'Request failed please check errorMessage key for more details',
				errorMessage: error.message,
			});
		}
	})
	.post(authenticationVerifier, async (req, res) => {
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

			res.status(200).json({ message: 'Operation Successful!' });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message:
					'Request failed please check errorMessage key for more details',
				errorMessage: error.message,
			});
		}
	});

module.exports = router;
