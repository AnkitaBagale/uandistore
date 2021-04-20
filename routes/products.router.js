const express = require("express");
const router = express.Router();
const {Product} = require("../models/product.model");
const {extend} = require("lodash");

router.route("/")
.get( async (req,res)=>{
    try {
        const products = await Product.find({});
        res.status(200).json({response : products, success : true });

    } catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
    
})
.post( async (req,res)=>{
    try {
        const productData = req.body;
        const NewProduct = new Product(productData);
        const addedProductFromDb = await NewProduct.save();
        res.status(201).json({ response : addedProductFromDb, success : true })
    }  catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})

module.exports = router;