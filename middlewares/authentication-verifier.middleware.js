const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;
const { User } = require('../models/user.model');

const authenticationVerifier = async (req, res, next) => {
	try {
		const tokenWithBearer = req.headers.authorization;
		const token = tokenWithBearer.split(' ')[1];
		const decoded = jwt.verify(token, JWT_KEY);

		userId = decoded.userId;
		const user = await User.findById(userId);

		if (!user) {
			res.status(401).json({ message: 'Unauthorized access' });
			return;
		}
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		res
			.status(401)
			.json({ message: 'Unauthorized access', errorMessage: error.message });
	}
};

module.exports = authenticationVerifier;
