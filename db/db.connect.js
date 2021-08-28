const mongoose = require('mongoose');

const initializeConnectionToDb = async () => {
	try {
		await mongoose.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('db connected');
	} catch (error) {
		console.log(error);
	}
};

module.exports = initializeConnectionToDb;
