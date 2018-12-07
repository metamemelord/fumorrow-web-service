const jwt = require("jsonwebtoken");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("../HelperFunctions").isEmpty;

module.exports = function(req, res, next){
	jwt.verify(req.token, process.env.key, function (error, authData) {
		if (error) {
			if (error["name"] == "TokenExpiredError") {
				return res.status(401).json({
					"status": {
						"code": 401,
						"message": "Token expired"
					},
					"data": null
				});
			}
			logger.error("Attempt to login with invalid token");
			return res.status(400).json({
				"status": {
					"code": 400,
					"message": "Invalid token"
				},
				"data": null
			});
		} else {
			if (isEmpty(authData) || isEmpty(authData["username"])) {
				return res.status(403).json({
					"status": {
						"code": 403,
						"message": "Invalid user"
					},
					"data": null
				});
			} else {
				next();
			}
		}
	});
};