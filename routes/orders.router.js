const express = require('express');
const {
	getOrderDetails,
	createNewOrder,
} = require('../controllers/orders.controller');
const router = express.Router();

router.route('/').get(getOrderDetails).post(createNewOrder);

module.exports = router;
