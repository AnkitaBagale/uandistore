const express = require('express');
const router = express.Router();

const {
	getAllAddressesOfUser,
	createNewAddress,
	updateAddress,
	deleteAddress,
} = require('../controllers/addresses.controller');

router.route('/:userId/addresses').get(getAllAddressesOfUser);
router.route('/:userId/addresses').post(createNewAddress);

router.route('/:userId/addresses/:addressId').post(updateAddress);

router.route('/:userId/addresses/:addressId').delete(deleteAddress);

module.exports = router;
