const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: 'user id is required',
		},
		payment: {
			mrp: { type: Number, default: 0 },
			discount: { type: Number, default: 0 },
			couponDiscount: { type: Number, default: 0 },
			totalPaid: { type: Number, default: 0 },
			charges: {
				shipping: {
					type: Number,
					default: 0,
				},
				gst: {
					type: Number,
					default: 0,
				},
			},
		},
		items: [
			{
				productId: { type: Schema.Types.ObjectId, ref: 'Product' },
				payment: {
					amount: { type: Number, default: 0 },
					offer: { type: Number, default: 0 },
				},
				quantity: { type: Number, default: 1 },
			},
		],
		address: {
			type: String,
			required: 'address id is required',
		},
	},
	{ timestamps: true },
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };
