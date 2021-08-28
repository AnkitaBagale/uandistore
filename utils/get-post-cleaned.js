const { getTimeFormatted } = require('./get-time-formatted');

const getPostCleaned = (post, viewerId) => {
	post.__v = undefined;
	post.updatedAt = undefined;
	post._doc.totalLikes = post.likes.length;
	post._doc.likedByViewer = post.likes.includes(viewerId);
	post.likes = undefined;
	post._doc.time = getTimeFormatted(post.createdAt);
	post._doc.createdAt = post.createdAt.getTime();

	return post;
};

module.exports = { getPostCleaned };
