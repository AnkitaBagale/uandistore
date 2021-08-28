const { SocialProfile } = require('../models/socialProfile.model');
const { Post } = require('../models/post.model');
const { getPostCleaned } = require('../utils/get-post-cleaned');
const {
	getNameFromSocialProfile,
} = require('../utils/get-name-from-social-profile');

const {
	pushLikeActivityInNotification,
} = require('../controllers/notifications.controller');
const { Notification } = require('../models/notification.model');

const getAllPostsFromDb = async (req, res) => {
	try {
		const { viewer } = req;
		const posts = await Post.find({
			userId: { $in: [...viewer.following, viewer._id] },
		})
			.populate({
				path: 'userId',
				select: 'userName avatar',
			})
			.sort({ createdAt: -1 });

		for (post of posts) {
			post = getPostCleaned(post, viewer._id);
		}
		res.status(200).json({
			response: posts,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const createNewPost = async (req, res) => {
	try {
		const { viewer } = req;
		const postDetails = req.body;
		let newPost = new Post({ ...postDetails, userId: viewer._id });
		await newPost.save();

		await newPost
			.populate({
				path: 'userId',
				select: 'userName avatar',
			})
			.execPopulate();

		newPost = getPostCleaned(newPost, viewer._id);
		res.status(200).json({
			response: newPost,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getAllPostsOfUserFromDb = async (req, res) => {
	try {
		const { viewer } = req;

		const { userName } = req.params;
		const user = await SocialProfile.findOne({ userName });
		if (!user) {
			res.status(403).json({ message: 'User not found!' });
			return;
		}
		const posts = await Post.find({ userId: user._id })
			.populate({
				path: 'userId',
				select: 'userName avatar',
			})
			.sort({ createdAt: -1 });

		for (post of posts) {
			post = getPostCleaned(post, viewer._id);
		}
		res.status(200).json({
			response: posts,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const getUsersWhoLikedThePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const { viewer } = req;

		const post = await Post.findById(postId, { likes: 1 })
			.lean()
			.populate({
				path: 'likes',
				select: 'userId avatar userName followers',
				populate: { path: 'userId', select: 'firstname lastname' },
			});

		post.likes = post.likes.map((user) =>
			getNameFromSocialProfile(user, viewer._id),
		);

		res.status(200).json({ response: post.likes });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const likeOrDislikeThePost = async (req, res) => {
	try {
		const { viewer } = req;

		let isLiked = false;
		const { postId } = req.params;
		const post = await Post.findById(postId);
		if (!post) {
			res.status(400).json({ message: 'No post found' });
			return;
		}

		const index = post.likes.indexOf(viewer._id);

		if (index === -1) {
			post.likes.unshift(viewer._id);
			isLiked = true;
			await pushLikeActivityInNotification({
				userIdWhoLiked: viewer._id,
				otherUserId: post.userId,
				likedPostId: post._id,
				type: 'like',
			});
		} else {
			post.likes.splice(index, 1);
			await pushLikeActivityInNotification({
				userIdWhoLiked: viewer._id,
				otherUserId: post.userId,
				likedPostId: post._id,
				type: 'dislike',
			});
		}

		await post.save();
		res.status(200).json({ isLiked });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const deletePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const { viewer } = req;

		const post = await Post.findOne({ _id: postId, userId: viewer._id });

		if (!post) {
			res.status(400).json({ message: 'No post found' });
			return;
		}
		await post.remove();
		await Notification.deleteMany({ likedPost: post._id });

		res.status(200).json({ response: post._id });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};
module.exports = {
	getAllPostsFromDb,
	createNewPost,
	getUsersWhoLikedThePost,
	likeOrDislikeThePost,
	getAllPostsOfUserFromDb,
	deletePost,
};
