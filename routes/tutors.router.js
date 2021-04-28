const express = require("express");
const router = express.Router();
const { Tutor } = require("../models/tutor.model");

router.route("/")
.get(async (req,res)=>{
    try{
        const tutors = await Tutor.find({});
        res.status(201).json({response: tutors, success: true})
    } catch(error) {
        res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
    
})
.post( async (req,res)=>{
    try {
        tutorDetails = req.body;
        let NewTutor = new Tutor(tutorDetails);
        NewTutor = await NewTutor.save();
        res.status(201).json({response: NewTutor, success: true})
    } catch(error) {
        res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
})

module.exports = router;