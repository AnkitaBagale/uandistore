const { Notification } = require('../models/notification.model');

const pushActivityInNotification = async ({ userIdWhoLiked, likedPostId }) => {
	let notifications = await Notification.find({ userId: post.userId });
	if (!notifications) {
		notifications = new Notification({ userId: post.userId, activity: [] });
		await notifications.save();
	}

	const activity = {
		userId: userIdWhoLiked,
		likedPost: likedPostId,
		activityTitle: 'liked your post',
		time: new Date(),
	};
	notifications.activity.unshift(activity);
	return notifications;
};

module.exports = { pushActivityInNotification };
