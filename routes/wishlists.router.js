const express = require("express");
const router = express.Router();
const { Wishlist } = require("../models/wishlist.model");
const { User } = require("../models/user.model");
const { extend } = require("lodash");

router.route("/")
.get( async (req,res)=>{
    try {
        const wishlists = await Wishlist.find({});
        res.json({ response : wishlists, success : true });
    } catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }  
})

router.param("userid", async(req, res, next, id)=>{
    try{
        const user = await User.findById({_id: id});
        console.log("I was in 1st param")
        if(!user){
            res.status(404).json({success:false, message: "No user found associated, please check the user id!"});
            return;
        }
        req.user = user;
        next();
    } catch(error) {
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})
router.param("userid", async(req,res,next,id)=>{
    try {
        let wishlist = await Wishlist.findOne({userId: id});
        console.log("I was in 2nd param");
        if(!wishlist){
            wishlist = new Wishlist({userId:id, products: []});
            wishlist = await wishlist.save();
        }
        req.wishlist = wishlist;
        next();
    } catch(error) {
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})

router.route("/:userid/wishlist")
.get( async(req,res)=>{
    try { 
        const {wishlist} = req ;
        res.json({ response : wishlist, success : true });

    }  catch(error) {
        console.error(error)
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})
.post( async(req,res)=>{
    try {       
        const productUpdates = req.body;
        const {wishlist} = req ;
        
        const isProductAlreadyAdded = wishlist.products.find((product)=>product.productId == productUpdates._id);
        console.log(isProductAlreadyAdded);
        if(isProductAlreadyAdded){
           for( let product of wishlist.products) {
                if(productUpdates._id == product.productId){
                    product.active = !product.active;
                }
           }
        } else {
            wishlist.products.push({productId: productUpdates._id, active: true});
        } 
        const resback = await wishlist.save();
        res.json({ response : resback, success : true })

    }  catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
    
})


module.exports = router;