const express = require('express');
const router = express.Router();
const { Address } = require('../models/address.model');
const { extend, add } = require('lodash');

router.route('/:userId/addresses').get(async (req, res) => {
	try {
		const { userId } = req.params;
		const addresses = await Address.find({ userId: userId });

		res.status(200).json({ response: addresses, success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
});
router.route('/:userId/addresses').post(async (req, res) => {
	try {
		const { userId } = req.params;
		let newAddress = req.body;
		newAddress = new Address(newAddress);

		await newAddress.save();

		const updatedAddressesFromDb = await Address.find({ userId: userId });

		res.status(201).json({ response: updatedAddressesFromDb, success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
});

router.route('/:userId/addresses/:addressId').post(async (req, res) => {
	try {
		const { userId, addressId } = req.params;
		const addressUpdates = req.body;

		let address = await Address.findById({ _id: addressId });
		address = extend(address, addressUpdates);

		await address.save();

		const updatedAddressesFromDb = await Address.find({ userId: userId });

		res.status(200).json({ response: updatedAddressesFromDb, success: true });
	} catch (error) {
		res.json({
			success: false,
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
});

router.route('/:userId/addresses/:addressId').delete(async (req, res) => {
	try {
		const { userId, addressId } = req.params;

		let address = await Address.findById({ _id: addressId });

		await address.remove();

		const updatedAddressesFromDb = await Address.find({ userId: userId });

		res.status(200).json({ response: updatedAddressesFromDb, success: true });
	} catch (error) {
		res.json({
			success: false,
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
});

module.exports = router;
