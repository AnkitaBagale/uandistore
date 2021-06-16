const { Notification } = require('../models/notification.model');
const { getTimeFormatted } = require('../utils/get-time-formatted');

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
	try {
		if (userIdWhoLiked.toString() === otherUserId.toString()) {
			return;
		}
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
			let notifications = await Notification.find({ userId: otherUserId });
			if (notifications.length > 10) {
				await notifications[0].remove();
			}
		}
		if (type === 'dislike') {
			const notification = await Notification.findOne({
				userId: otherUserId,
				activityUserId: userIdWhoLiked,
				likedPost: likedPostId,
				activityType: 'like',
			});
			if (notification) {
				await notification.remove();
			}
		}
	} catch (error) {
		console.log(error);
	}
};

const pushFollowActivityInNotification = async ({
	userIdWhoFollowed,
	otherUserId,
	type,
}) => {
	try {
		if (userIdWhoFollowed.toString() === otherUserId.toString()) {
			return;
		}

		if (type === 'follow') {
			const activity = {
				userId: otherUserId,
				activityUserId: userIdWhoFollowed,
				activityTitle: activityTypes[type],
				activityType: 'follow',
				likedPost: null,
			};
			const newNotification = new Notification(activity);
			await newNotification.save();

			let notifications = await Notification.find({ userId: otherUserId });
			if (notifications.length > 10) {
				await notifications[0].remove();
			}
		}
		if (type === 'unfollow') {
			const notification = await Notification.findOne({
				userId: otherUserId,
				activityUserId: userIdWhoFollowed,
				likedPost: null,
				activityType: 'follow',
			});
			if (notification) {
				await notification.remove();
			}
		}
	} catch (error) {
		console.log(error);
	}
};

const getNotificationsOfUser = async (req, res) => {
	try {
		const userId = req.viewer._id;

		let notifications = await Notification.find(
			{ userId },
			{ activityUserId: 1, activityTitle: 1, likedPost: 1, createdAt: 1 },
		)
			.lean()
			.populate({ path: 'activityUserId', select: 'userName avatar' })
			.populate({ path: 'likedPost', select: 'caption' })
			.sort({ createdAt: -1 });
		for (notification of notifications) {
			notification.time = getTimeFormatted(notification.createdAt);
		}
		res.status(200).json({ response: notifications });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	pushLikeActivityInNotification,
	pushFollowActivityInNotification,
	getNotificationsOfUser,
};
