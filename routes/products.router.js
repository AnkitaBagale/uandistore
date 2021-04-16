const express = require("express");
const router = express.Router();
const {Product} = require("../models/product.model");

router.route("/")
.get( async (req,res)=>{
    try {
        const products = await Product.find({});
        res.json({ response : products, success : true });
    } catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
    
})
.post( async (req,res)=>{
    try {
        const sentData = req.body;
        const newProduct = new Product(sentData);
        const addedProduct = await newProduct.save();
        res.json({ response : addedProduct, success : true })
    }  catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})

router.route("/:id")
.get( async(req,res)=>{
    try {
        const { id } = req.params;
        const productFound = await Product.findOne({_id: id});
        
        if(!productFound){
            res.status(404).json({success:false, message: "No product found associated, please check the product id!"});
            return;
        }
        
        res.json({ response : productFound, success : true })
    }  catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})
.post( async(req,res)=>{
    try {
        const { id } = req.params;
        const updateProduct = req.body;
        const productFound = await Product.findOne({_id: id});
        
        if(!productFound){
            res.status(404).json({success:false, message: "No product found associated, please check the product id!"});
            return;
        }
        
        Object.keys(updateProduct).map( (key)=>{
            if(key in productFound){
                productFound[key] = updateProduct[key]
            }
        })
        const resback = await productFound.save();
        res.json({ response : resback, success : true })

    }  catch(error){
        res.json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
    
})


module.exports = router;