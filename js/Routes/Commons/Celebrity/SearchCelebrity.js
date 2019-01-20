const express = require("express");
const filename = require("path").basename(__filename);
const logger = require("../../../Loggers/index").LoggerFactory.getLogger(filename);
const helpers = require("../../../lib/HelperFunctions");
const AbstractCelebritySearchStrategy = require("../../../lib/CelebritySearch/AbstractCelebritySearchStrategy");

var searchCelebrityRoute = express.Router();

searchCelebrityRoute.post("/api/admin/celebrities/search", function (req, res) {
	try {
		var parameter = req.body.parameter;
		if (helpers.isEmpty(parameter) || !(helpers.isString(parameter) || helpers.isInteger(parameter))) {
			return res.status(400).json({
				"status": {
					"code": 400,
					"message": "Invalid parameter"
				},
				"data": null
			});
		}
		const searchStrategy = AbstractCelebritySearchStrategy.getSearchStrategy(parameter);
		searchStrategy.search(parameter, function (status, message, data) {
			return res.status(status).json({
				"status": {
					"code": status,
					"message": message
				},
				"data": data
			});
		});
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
});

module.exports = searchCelebrityRoute;