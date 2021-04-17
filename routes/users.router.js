const express = require("express");
const router = express.Router();
const {User} = require("../models/user.model");

router.route("/")
.get( async (req,res)=>{
    try {
        const users = await User.find({});
        res.json({ response : users, success : true });
    } catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    } 
})
.post( async (req,res)=>{
    try {
        const sentData = req.body;
        const existingUser = User.findOne({username: sentData.username});
        
        if(existingUser){
            res.status(409).json({success: false, message: "Account already exists for this email, please reset password if forgotten"});
            return;
        }
        const newUser = new User(sentData);
        const addedUser = await newUser.save();
        res.json({ response : addedUser, success : true })
    }  catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})

router.route("/:id")
.get( async(req,res)=>{
    try {
        const { id } = req.params;
        const UserFound = await User.findOne({_id: id});
        
        if(!UserFound){
            res.status(404).json({success:false, message: "No User found associated, please check the User id!"});
            return;
        }
        
        res.json({ response : UserFound, success : true })
    }  catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})
.post( async(req,res)=>{
    try {
        const { id } = req.params;
        const updateUser = req.body;
        const UserFound = await User.findOne({_id: id});
        
        if(!UserFound){
            res.status(404).json({success:false, message: "No User found associated, please check the User id!"});
            return;
        }
        
        Object.keys(updateUser).map( (key)=>{
            if(key in UserFound){
                UserFound[key] = updateUser[key]
            }
        })
        const resback = await UserFound.save();
        res.json({ response : resback, success : true })

    }  catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }  
})


module.exports = router;