const routeNotFoundHandler = (req, res) => {
	res
		.status(404)
		.json({ message: 'route is not found on server, please check' });
};

module.exports = routeNotFoundHandler;
