const express = require('express');
const {
	getOrderDetails,
	createNewOrder,
	getRazorpayOrderId,
} = require('../controllers/orders.controller');
const router = express.Router();

router.route('/').get(getOrderDetails).post(createNewOrder);

router.route('/razorpay').post(getRazorpayOrderId);

module.exports = router;
