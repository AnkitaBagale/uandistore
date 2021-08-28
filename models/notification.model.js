const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'SocialProfile',
			required: 'User id is required',
		},
		activityUserId: {
			type: Schema.Types.ObjectId,
			ref: 'SocialProfile',
			required: 'activityUserId id is required',
		},
		activityTitle: {
			type: String,
		},
		activityType: {
			type: String,
			enum: ['follow', 'like'],
		},
		likedPost: {
			type: Schema.Types.ObjectId,
			ref: 'Post',
			default: null,
		},
	},
	{ timestamps: true },
);

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { Notification };
