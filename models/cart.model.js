const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{ productID: {type:Schema.Types.ObjectId, ref:'Product'}, quantity: Number, status: [String] }]
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = {Cart};