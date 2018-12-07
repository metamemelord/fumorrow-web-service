const jwt = require("jsonwebtoken");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

function verifyToken(userDetails, callback) {
	try {
		jwt.verify(userDetails.token, process.env.key, function (error, data) {
			if (error) {
				if (error.name === "TokenExpiredError") {
					return callback(401, "Token expired", null);
				} else {
					logger.error(error);
					return callback(403, "Invalid signature", null);
				}
			} else {
				var result = (data.privilages.includes(userDetails.domain) && userDetails.username === data.username);
				if (result) {
					return callback(200, "Ok", {
						"username": userDetails.username,
					});
				} else {
					return callback(403, "Unauthorized", {
						"username": userDetails.username,
					});
				}
			}
		});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

module.exports = verifyToken;
