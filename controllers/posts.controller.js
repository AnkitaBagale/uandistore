const { SocialProfile } = require('../models/socialProfile.model');
const { Post } = require('../models/post.model');
const { getPostCleaned } = require('../utils/get-post-cleaned');
const {
	getNameFromSocialProfile,
} = require('../utils/get-name-from-social-profile');

const getAllPostsFromDb = async (req, res) => {
	try {
		const userId = req.user._id;
		const viewer = await SocialProfile.findOne({ userId });
		if (!viewer) {
			res.status(403).json({ message: 'User not found!' });
			return;
		}
		const posts = await Post.find({})
			.populate({
				path: 'userId',
				select: 'userName',
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
		const userId = req.user._id;
		const viewer = await SocialProfile.findOne({ userId });
		if (!viewer) {
			res.status(403).json({ message: 'User not found!' });
			return;
		}

		const postDetails = req.body;
		let newPost = new Post({ ...postDetails, userId: viewer._id });
		await newPost.save();

		await newPost
			.populate({
				path: 'userId',
				select: 'userName',
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

const getUsersWhoLikedThePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const post = await Post.findById(postId, { likes: 1 })
			.lean()
			.populate({
				path: 'likes',
				select: 'userId userName',
				populate: { path: 'userId', select: 'firstname lastname' },
			});

		post.likes = post.likes.map((user) => getNameFromSocialProfile(user));

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
		const userId = req.user._id;
		const viewer = await SocialProfile.findOne({ userId });
		if (!viewer) {
			res.status(403).json({ message: 'Invalid request' });
			return;
		}
		const { postId } = req.params;
		const post = await Post.findById(postId);
		if (!post) {
			res.status(400).json({ message: 'No post found' });
			return;
		}
		const index = post.likes.indexOf(viewer._id);

		index >= 0 ? post.likes.splice(index, 1) : post.likes.unshift(viewer._id);

		await post.save();

		res.status(200).json({ message: 'Operation successful!' });
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
};
