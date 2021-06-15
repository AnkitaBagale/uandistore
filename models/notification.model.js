const mongoose = require('mongoose');
const { Schema } = mongoose;

const childSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'SocialProfile',
		required: 'User id is required',
	},
	likedPost: {
		type: Schema.Types.ObjectId,
		ref: 'Post',
		default: null,
	},
	activityTitle: {
		type: String,
	},
	seen: { type: Boolean, default: false },
	time: {
		type: String,
	},
});
const NotificationSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'SocialProfile',
			required: 'User id is required',
		},
		activity: [childSchema],
	},
	{ timeStamps: true },
);

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { Notification };
