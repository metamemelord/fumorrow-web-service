const helpers = require("../../../lib/HelperFunctions");
const isEmpty = helpers.isEmpty;

module.exports = (mediaDetails) => {
	if (isEmpty(mediaDetails)) {
		return "";
	}
	return mediaDetails.category + "/" +
		(isEmpty(mediaDetails.sub_category) ? "" : (mediaDetails.sub_category + "/") + mediaDetails.title) + "-" +
		helpers.generateSalt(15);
};
