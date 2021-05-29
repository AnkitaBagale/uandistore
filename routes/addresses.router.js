const express = require('express');
const router = express.Router();

const {
	getAllAddressesOfUser,
	createNewAddress,
	getAddressFromDb,
	updateAddress,
	deleteAddress,
} = require('../controllers/addresses.controller');

router.route('/').get(getAllAddressesOfUser).post(createNewAddress);

router.param('addressId', getAddressFromDb);
router.route('/:addressId').post(updateAddress).delete(deleteAddress);

module.exports = router;
