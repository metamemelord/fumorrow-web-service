const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("../../lib/HelperFunctions").isEmpty;

module.exports = (req, res, next) => {
	try {
		if (isEmpty(req.body.title) || isEmpty(req.body.day) || isEmpty(req.body.month) ||
			isEmpty(req.body.year) || isEmpty(req.body.category) || isEmpty(req.body.funding_status) || isEmpty(req.body.address)) {
			return res.status(400).json({
				"status": {
					"code": 400,
					"message": "Mandatory fields cannot be left blank"
				},
				"data": null
			});
		}
		else {
			next();
		}
	}
	catch (error) {
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