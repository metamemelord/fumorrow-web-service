const express = require("express");
const DAL = require("../../DAL/index");
const tokenVerifier = DAL.TokenVerification;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../Utils/HelperFunctions").isEmpty;

var tokenVerificationRouter = express.Router();

tokenVerificationRouter.post("/api/admin/auth", function (req, res) {
	try {
		if (isEmpty(req.body.username) || isEmpty(req.body.token) || isEmpty(req.body.domain))
			return res.status(400).json({
				"status": {
					"code": 400,
					"message": "Invalid credentials"
				},
				"data": null
			});
		var userDetails = {
			username: req.body.username.toLowerCase(),
			token: req.body.token,
			domain: req.body.domain
		};
		tokenVerifier(userDetails, function(status, message, data) {
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

module.exports = tokenVerificationRouter;