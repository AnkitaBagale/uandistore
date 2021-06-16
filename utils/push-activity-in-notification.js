const { Notification } = require('../models/notification.model');

const activityTypes = {
	like: 'liked your post',
	follow: 'started following you',
};

const pushLikeActivityInNotification = async ({
	userIdWhoLiked,
	otherUserId,
	likedPostId,
	type,
}) => {
	let notifications = await Notification.find({ userId: otherUserId });

	if (type === 'like') {
		const activity = {
			userId: otherUserId,
			activityUserId: userIdWhoLiked,
			activityTitle: activityTypes[type],
			activityType: 'like',
			likedPost: likedPostId,
		};
		const newNotification = new Notification(activity);
		await newNotification.save();
	}
	if (type === 'dislike') {
		const notification = await Notification.find({
			userId: otherUserId,
			activityUserId: userIdWhoLiked,
			likedPost: likedPostId,
		});
		if (notification) {
			await notification.remove();
		}
	}
	console.log(notifications);
};

module.exports = { pushActivityInNotification };
