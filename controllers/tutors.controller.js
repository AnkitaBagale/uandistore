const { Tutor } = require('../models/tutor.model');

const getAllTutorsFromDb = async (req, res) => {
	try {
		const tutors = await Tutor.find({});
		res.status(201).json({ response: tutors });
	} catch (error) {
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

const createNewTutor = async (req, res) => {
	try {
		tutorDetails = req.body;
		let NewTutor = new Tutor(tutorDetails);
		NewTutor = await NewTutor.save();
		res.status(201).json({ response: NewTutor });
	} catch (error) {
		res.status(500).json({
			message: 'Something went wrong',
			errorMessage: error.message,
		});
	}
};

module.exports = { getAllTutorsFromDb, createNewTutor };
