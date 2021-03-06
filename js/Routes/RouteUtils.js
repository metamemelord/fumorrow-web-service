const filename = require("path").basename(__filename);
const logger = require("../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("../lib/HelperFunctions").isEmpty;

const requestIdVerifier = (req, res, next) => {
	try {
		if (isEmpty(req.body._id)) {
			return res.status(400).json({
				"status": {
					"code": 400,
					"message": "ID cannot be empty"
				},
				"data": null
			});
		}
		else {
			next();
		}
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			"status": {
				"code": 500,
				"message": "Internal server error"
			},
			"data": null
		});
	}
};

module.exports = {
	requestIdVerifier: requestIdVerifier
};