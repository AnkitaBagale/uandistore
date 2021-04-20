const express = require("express");
const router = express.Router();
const { Cart } = require("../models/cart.model");
const { User } = require("../models/user.model");
const { extend } = require("lodash");

router.route("/")
.get( async (req,res)=>{
    try {
        const carts = await Cart.find({});
        res.status(200).json({ response : carts, success : true });
    } catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }  
})

router.param("userid", async(req, res, next, id)=>{
    try{
        const user = await User.findById({_id: id});
        
        if(!user){
            res.status(404).json({success:false, message: "No user found associated, please check the user id!"});
            return;
        }
        req.user = user;
        next();
    } catch(error) {
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})
router.param("userid", async(req,res,next,id)=>{
    try {
        let cart = await Cart.findOne({userId: id});
        
        if(!cart){
            cart = new Cart({userId:id, products: []});
            cart = await cart.save();
        }
        req.cart = cart;
        next();
    } catch(error) {
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})

router.route("/:userid/cart")
.get( async(req,res)=>{
    try { 
        let {cart} = req ;
        cart = await cart.populate({path:"products.productId", select: 'name price image offer inStock url',}).execPopulate();
        res.status(200).json({ response : cart, success : true });

    }  catch(error) {
        console.error(error)
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})
.post( async(req,res)=>{
    try {       
        const productUpdates = req.body;
        const {cart} = req ;
        
        const isProductAlreadyAdded = cart.products.find((product)=>product.productId == productUpdates._id);
        
        if(isProductAlreadyAdded){
           for( let product of cart.products) {
                if(productUpdates._id == product.productId){
                   product = extend(product, productUpdates);
                }
           }
        } else {
            cart.products.push({productId: productUpdates._id,  quantity: 1, active: true});
        } 
        let updatedCartFromDb = await cart.save();
        updatedCartFromDb = await updatedCartFromDb.populate({path:"products.productId", select: 'name price image offer inStock url',}).execPopulate();
        
        const updatedProductFromDb = updatedCartFromDb.products.find((item)=>item.productId._id == productUpdates._id)
       
        res.status(200).json({ response : updatedProductFromDb, success : true })

    }  catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
    
})


module.exports = router;