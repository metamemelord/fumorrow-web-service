const helpers = require('../../../Utils/HelperFunctions');
const isEmpty = helpers.isEmpty;

module.exports = (mediaDetails) => {
    return mediaDetails.category + "/" +
        (isEmpty(mediaDetails.sub_category) ? "" : (mediaDetails.sub_category + "/") + mediaDetails.title) + "-" +
        helpers.generateSalt(15);
};
