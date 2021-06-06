const getTimeFormatted = (time) => {
	const totalMinutes = Math.floor((Date.now() - time.getTime()) / (1000 * 60));
	if (totalMinutes <= 0) {
		return 'Just now';
	}
	if (totalMinutes < 60) {
		return `${totalMinutes} Minute ago`;
	}
	if (totalMinutes >= 60 && totalMinutes < 1440) {
		return `${Math.floor(totalMinutes / 60)} Hour ago`;
	}
	return time.toDateString();
};

module.exports = { getTimeFormatted };
