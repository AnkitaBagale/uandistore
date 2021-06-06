const getPostCleaned = (post, viewerId) => {
	post.__v = undefined;
	post.updatedAt = undefined;
	post._doc.totalLikes = post.likes.length;
	post._doc.likedByViewer = post.likes.includes(viewerId);
	post.likes = undefined;
	post._doc.time = post.createdAt.toDateString();
	post.createdAt = undefined;
	console.log({ post: post._doc });
	return post;
};

module.exports = { getPostCleaned };
