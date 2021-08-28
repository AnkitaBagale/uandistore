const mongoose = require('mongoose');
const { User } = require('./user.model');
const { Schema } = mongoose;

const PostSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'SocialProfile',
		},
		caption: String,
		content: {
			type: String,
			required: 'post content is required',
		},
		media: {
			type: String,
			default: '',
		},
		likes: [{ type: Schema.Types.ObjectId, ref: 'SocialProfile' }],
	},
	{
		timestamps: true,
	},
);

const Post = mongoose.model('Post', PostSchema);

module.exports = { Post };
