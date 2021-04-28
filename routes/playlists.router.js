const express = require("express");
const router = express.Router();
const { Playlist } = require("../models/playlist.model");
const { extend } = require("lodash");

router.route("/")
.post(async (req,res)=>{
    try {
        let newPlaylist = req.body;
        newPlaylist = new Playlist(newPlaylist);
        newPlaylist = await newPlaylist.save();
        
        res.status(201).json({response: newPlaylist, success: true})
    } catch(error) {
        res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
})

router.param("playlistId", async(req, res, next, id)=>{
    try {
        const playlist = await Playlist.findById(id);
        req.playlist = playlist;
        next();
    } catch(error) {
        res.status(404).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
})
router.route("/:playlistId")
.post(async (req, res)=>{
    try {
        let {playlist} = req;
        const playlistUpdates = req.body;
        playlist = extend(playlist, playlistUpdates);
        playlist = await playlist.save();
        res.status(200).json({response: playlist, success: true})

    } catch(error) {
        res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
})
.delete(async (req, res)=>{
    try {
        let {playlist} = req;
        if(playlist.isDefault){
            throw new Error("Cannot delete default playlist");
        }
        await playlist.remove();
        res.status(200).json({response: playlist, success: true})

    } catch(error) {
        res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
})

router.route("/:playlistId/videos")
.post(async (req, res)=>{
    try {
        let {playlist} = req;
        const videoUpdates = req.body;

        let newVideoList = playlist.videoList.filter(video => video.videoId !== videoUpdates.videoId);
        
        if(newVideoList.length !== playlist.videoList.length){
            playlist.videoList = newVideoList;
            playlist = await playlist.save();
            playlist = await playlist.populate("videoList.videoId").execPopulate();
            
            res.status(200).json({response: playlist, success:true});
            return;
        }

        playlist.videoList.push(videoUpdates);
        playlist = await playlist.save();
        playlist = await playlist.populate("videoList.videoId").execPopulate();
        res.status(201).json({response: playlist, success: true})

    } catch(error) {
        res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
})


module.exports = router;

