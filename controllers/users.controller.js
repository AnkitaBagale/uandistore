const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');
const { getToken } = require('../utils/get-token');

const createNewUser = async (req, res) => {
	try {
		const userData = req.body;

		const user = await User.findOne({ email: userData.email });

		if (user) {
			res.status(409).json({
				message: 'Account already exists for this email',
			});
			return;
		}

		const NewUser = new User(userData);
		const salt = await bcrypt.genSalt(10);
		NewUser.password = await bcrypt.hash(NewUser.password, salt);
		await NewUser.save();

		const token = getToken(NewUser._id);
		res.status(201).json({
			response: {
				firstname: NewUser.firstname,
				token,
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

const checkAuthenticationOfUser = async (req, res) => {
	try {
		const email = req.get('email');
		const password = req.get('password');
		const user = await User.findOne({ email });
		if (!user) {
			res.status(403).json({ message: 'Email or password is incorrect!' });
		} else {
			const isValidPassword = await bcrypt.compare(password, user.password);

			if (isValidPassword) {
				const token = getToken(user._id);
				res.status(200).json({
					response: {
						firstname: user.firstname,
						token,
					},
				});
			} else {
				res.status(403).json({ message: 'Email or password is incorrect!' });
			}
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong!',
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

module.exports = {
	createNewUser,
	checkAuthenticationOfUser,
	getUserDetailsFromDb,
};
