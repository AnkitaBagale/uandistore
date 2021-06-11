const getIsFollowedByViewer = (user, viewerId) => {
	user.followedByViewer = !!user.followers.find(
		(id) => id.toString() === viewerId.toString(),
	);
	user.followers = undefined;
	return user;
};
module.exports = { getIsFollowedByViewer };
