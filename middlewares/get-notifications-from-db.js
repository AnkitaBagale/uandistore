const { Notification } = require('../models/notification.model');

const getNotificationsFromDb = async ({ userIdInPost }) => {
	try {
		let notifications = await Notification.find({ userId: userIdInPost });
		if (!notifications) {
			notifications = new Notification({ userId: userIdInPost, activity: [] });
			await notifications.save();
		}
		req.notifications = notifications;
		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

module.exports = { getNotificationsFromDb };
