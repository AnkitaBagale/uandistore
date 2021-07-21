const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;

const getToken = (userId) => {
	const token = jwt.sign({ userId }, JWT_KEY, {
		expiresIn: '24h',
	});
	return token;
};

module.exports = { getToken };
