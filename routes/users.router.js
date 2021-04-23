const express = require("express");
const router = express.Router();
const {User} = require("../models/user.model");
const {extend} = require("lodash");
const e = require("express");

router.route("/")
.post( async (req,res)=>{
    try {
        const userData = req.body;
        
        const user = await User.findOne({email: userData.email});

        if(user){
            res.status(409).json({success: false, message: "Account already exists for this email, please reset password if forgotten"});
            return;
        }

        const NewUser = new User(userData);
        const addedUserDataFromDb = await NewUser.save();

        res.status(201).json({response: {firstname: addedUserDataFromDb.firstname, userId: addedUserDataFromDb._id}, success: true})

    }  catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})

router.route("/authenticate")
.post( async(req,res)=>{
    try {
        const email = req.get("email");
        const password = req.get("password")
        const user = await User.findOne({email});
        
        if(!user){
            res.status(401).json({success:false, message: "email is incorrect!"});
            return;
        }else if(user.password === password){
            res.status(200).json({response: {firstname: user.firstname, userId: user._id}, success: true});
            return;
        }
        res.status(401).json({ message : "Password is incorrect!", success : false });
        
    }  catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})

router.param("email", async(req, res, next, id)=>{
    const user = await User.findOne({email: id});
        
        if(!user){
            res.status(404).json({success:false, message: "email does not exist!"});
            return;
        }
        req.user = user;
        next();
})

router.route("/:email")
.post( async(req,res)=>{
    try {
        let { user } = req;
        
        const userUpdates = req.body

        user = extend(user, userUpdates)
        
        user = await user.save();
        res.status(200).json({ response:{email: user.email, firstname: user.firstname, lastname: user.lastname, userId: user._id}, success : true })

    }  catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }  
})

router.route("/:userId")
.get( async(req,res)=>{

    try {
        const {userId} = req.params;
        console.log(userId);
        const user = await User.findById({_id: userId});

        if(!user){
            res.status(404).json({success:false, message: "email does not exist!"});
            return;
        }
        
        res.status(200).json({ response : {email: user.email, firstname: user.firstname, lastname: user.lastname, userId: user._id}, success : true })

    }  catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})


module.exports = router;