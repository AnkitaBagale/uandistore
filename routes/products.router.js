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

router.param("id", async(req, res, next, id)=>{
    try {
        const product = await Product.findById({_id: id});
    
        if(!product){
            res.status(404).json({success:false, message: "No product found associated, please check the product id!"});
            return;
        }

        req.product = product;
        next();
    } catch {
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})

router.route("/:id")
.get( async(req,res)=>{
    try {
        const {product} = req     
        res.status(200).json({ response : product, success : true })

    }  catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})
.post( async(req,res)=>{
    try {
        
        const productUpdates = req.body;
        let {product} = req;
         
        product = extend(product, productUpdates);
        
        const updatedProductFromDb = await product.save();
        res.status(200).json({ response : updatedProductFromDb, success : true })

    }  catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
    
})


module.exports = router;