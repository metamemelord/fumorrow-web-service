const filename = require('path').basename(__filename);
const logger = require('../../../../Loggers').LoggerFactory.getLogger(filename);

module.exports.upload = function (mediaDetails, callback) {
    switch (mediaDetails.type) {
        case 'image':
            require('../images/Upload')(mediaDetails, callback);
            break;
        default:
            logger.error("Unknown type received");
            callback(503, "Please contact admin", null);
            break;
    }
};
