const getSocialProfileCleaned = (userDetails, viewerId) => {
	userDetails._doc.followingViewer = userDetails.following.includes(viewerId);
	userDetails._doc.followedByViewer = userDetails.followers.includes(viewerId);
	userDetails._doc.count = {
		followers: userDetails.followers.length,
		following: userDetails.following.length,
	};

	userDetails._doc.name =
		userDetails.userId.firstname + ' ' + userDetails.userId.lastname;

	userDetails.userId = undefined;
	userDetails.followers = undefined;
	userDetails.following = undefined;
	userDetails.__v = undefined;

	return userDetails;
};

module.exports = { getSocialProfileCleaned };
