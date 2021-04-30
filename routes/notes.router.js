const express = require("express");
const router = express.Router();
const { Note } = require("../models/note.model");
const { extend } = require("lodash")

router.route("/")
.post(async(req,res)=>{
    try {
        let newNote = req.body;
        newNote = new Note(newNote);
        newNote = await newNote.save();
        res.status(201).json({response: newNote, success: true})
    } catch(error) {
        res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
    
})

router.param("noteId", async(req,res,next,id)=>{
    try{
        const note = await Note.findById(id);  
        req.note = note;
        next();
    } catch(error) {
        res.status(404).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
})

router.route("/:noteId")
.post(async(req,res)=>{
    try{
        const noteUpdates = req.body;
        let {note} = req;
        note = extend(note, noteUpdates);
        note = await note.save();
        res.status(200).json({response: note, success: true})
        
    } catch(error) {
        res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
})
.delete(async(req,res)=>{
    try{
        let {note} = req;
        note = await note.remove();
        res.status(200).json({response: note, success: true})
        
    } catch(error) {
        res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }  
})


module.exports = router;