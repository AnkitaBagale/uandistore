const { Address } = require('../models/address.model');
const { extend } = require('lodash');

const getAllAddressesOfUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const addresses = await Address.find(
			{ userId },
			{
				name: 1,
				streetAddress: 1,
				city: 1,
				state: 1,
				country: 1,
				zipCode: 1,
				phoneNumber: 1,
			},
		);
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
		const userId = req.user._id;
		let newAddress = req.body;
		newAddress = new Address({ ...newAddress, userId });
		await newAddress.save();

		const updatedAddressesFromDb = await Address.find(
			{ userId: userId },
			{
				name: 1,
				streetAddress: 1,
				city: 1,
				state: 1,
				country: 1,
				zipCode: 1,
				phoneNumber: 1,
			},
		);
		res.status(201).json({ response: updatedAddressesFromDb });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getAddressFromDb = async (req, res, next, id) => {
	try {
		const userId = req.user._id;
		const address = await Address.findById({ _id: id, userId });

		if (!address) {
			res
				.status(404)
				.json({ message: 'This addresss is not asscociated with user' });
			return;
		}
		req.address = address;
		next();
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
		let { address } = req;
		const addressUpdates = req.body;
		address = extend(address, addressUpdates);
		await address.save();
		const updatedAddressesFromDb = await Address.find(
			{ userId: userId },
			{
				name: 1,
				streetAddress: 1,
				city: 1,
				state: 1,
				country: 1,
				zipCode: 1,
				phoneNumber: 1,
			},
		);

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
		const { address } = req;
		await address.remove();

		const updatedAddressesFromDb = await Address.find(
			{ userId: userId },
			{
				name: 1,
				streetAddress: 1,
				city: 1,
				state: 1,
				country: 1,
				zipCode: 1,
				phoneNumber: 1,
			},
		);

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
	getAddressFromDb,
	updateAddress,
	deleteAddress,
};
