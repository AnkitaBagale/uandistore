const getNameFromSocialProfile = (user, viewerId) => {
	user.name = user.userId.firstname + ' ' + user.userId.lastname;
	user.followedByViewer = !!user.followers.find(
		(id) => id.toString() === viewerId.toString(),
	);
	user.followers = undefined;
	user.userId = undefined;
	return user;
};
module.exports = { getNameFromSocialProfile };
