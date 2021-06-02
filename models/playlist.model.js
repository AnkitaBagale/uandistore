const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlaylistSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		title: { type: String, default: '' },
		description: { type: String, default: '' },
		thumbnail: {
			type: String,
			default:
				'https://i.postimg.cc/TwsBcV04/jess-bailey-l3-N9-Q27z-ULw-unsplash.jpg',
		},
		type: {
			type: String,
			enum: ['custom', 'watchlater', 'liked', 'history'],
			default: 'custom',
		},
		isDefault: { type: Boolean, default: false },
		videoList: [
			{
				videoId: { type: Schema.Types.String, ref: 'Video' },
				date: { type: String },
			},
		],
	},
	{ timestamps: true },
);

const Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = { Playlist };
