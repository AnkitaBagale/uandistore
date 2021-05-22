const { Tutor } = require('../models/tutor.model');

const getAllTutorsFromDb = async (req, res) => {
	try {
		const tutors = await Tutor.find({});
		res.status(201).json({ response: tutors });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const createNewTutor = async (req, res) => {
	try {
		const tutorDetails = req.body;
		let NewTutor = new Tutor(tutorDetails);
		NewTutor = await NewTutor.save();
		res.status(201).json({ response: NewTutor });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

module.exports = { getAllTutorsFromDb, createNewTutor };
