const express = require("express");
const filename = require("path").basename(__filename);
const logger = require("../Loggers/index").LoggerFactory.getLogger(filename);

var unknownRequestHandlingRouter = express.Router();

unknownRequestHandlingRouter.post("*", function (req, res) {
	try {
		logger.warn("Access tried to :", req.url);
		return res.status(400).json({
			"status":{
				"code":400,
				"message":"Invalid route"
			},
			"data":null
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

module.exports = unknownRequestHandlingRouter;