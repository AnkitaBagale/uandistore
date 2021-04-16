const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name : String,
    image : String,
    price : Number,
    category : String,
    brand : String,
    inStock : Boolean,
    fastDelivery : Boolean,
    rating : {
        starRating: Number, 
        totalReviews: Number
    },
    offer : Number,
    level : String,
    avalQty: Number
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = {Product};