const getNameFromSocialProfile = (user) => {
	user.name = user.userId.firstname + ' ' + user.userId.lastname;
	user.userId = undefined;
	return user;
};
module.exports = { getNameFromSocialProfile };
