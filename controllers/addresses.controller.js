const { Address } = require('../models/address.model');
const { extend } = require('lodash');

const getAllAddressesOfUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const addresses = await Address.find({ userId: userId });

		res.status(200).json({ response: addresses });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const createNewAddress = async (req, res) => {
	try {
		const { userId } = req.params;
		let newAddress = req.body;
		newAddress = new Address(newAddress);

		await newAddress.save();

		const updatedAddressesFromDb = await Address.find({ userId: userId });

		res.status(201).json({ response: updatedAddressesFromDb });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const updateAddress = async (req, res) => {
	try {
		const { userId, addressId } = req.params;
		const addressUpdates = req.body;

		let address = await Address.findById({ _id: addressId });
		address = extend(address, addressUpdates);

		await address.save();

		const updatedAddressesFromDb = await Address.find({ userId: userId });

		res.status(200).json({ response: updatedAddressesFromDb });
	} catch (error) {
		console.error(error);
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const deleteAddress = async (req, res) => {
	try {
		const { userId, addressId } = req.params;

		let address = await Address.findById({ _id: addressId });

		await address.remove();

		const updatedAddressesFromDb = await Address.find({ userId: userId });

		res.status(200).json({ response: updatedAddressesFromDb });
	} catch (error) {
		console.error(error);
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	getAllAddressesOfUser,
	createNewAddress,
	updateAddress,
	deleteAddress,
};
