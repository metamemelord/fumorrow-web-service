const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("../../Utils/HelperFunctions").isEmpty;

module.exports = (req, res, next) => {
	try {
		if (isEmpty(req.body.car_name) || isEmpty(req.body.brand_name) || isEmpty(req.body.month) ||
            isEmpty(req.body.year)) {
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