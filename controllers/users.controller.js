const { User } = require('../models/user.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_KEY = process.env.JWT_KEY;

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

		res.status(201).json({ message: 'User is signed up!' });
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
				const token = jwt.sign({ userId: user._id }, JWT_KEY, {
					expiresIn: '24h',
				});
				res.status(200).json({
					response: { firstname: user.firstname, token },
				});
			} else {
				res.status(401).json({ message: 'Email or password is incorrect!' });
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

const updatePassword = async (req, res) => {
	try {
		const user = req.body;
		let userFromDb = await User.findOne({ email: user.email });

		if (!userFromDb) {
			res.status(403).json({ message: 'User does not exist' });
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
	updatePassword,
};
