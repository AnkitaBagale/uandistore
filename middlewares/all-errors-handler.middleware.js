const allErrorsHandler = (error, req, res, next) => {
	console.error(error.stack);
	res.status(500).json({
		message: 'error occured, see the errorMessage key for more details',
		errorMessage: error.message,
	});
};

module.exports = allErrorsHandler;
