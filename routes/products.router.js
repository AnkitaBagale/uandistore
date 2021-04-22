const express = require("express");
const router = express.Router();
const {Product} = require("../models/product.model");

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
router.route("/:id")
.get( async (req,res)=>{
    try {
        const productId = req.params;
        
        const product = await Product.findById({_id: productId.id});
        if(product){
            res.status(200).json({response : product, success : true });
        }else{
            res.status(404).json({success:false, message:"No product found"})
        }  

    } catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
    
})
module.exports = router;