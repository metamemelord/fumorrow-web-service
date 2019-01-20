const express = require("express");
const DAL = require("./../../../DAL/index");
const celebritiesDAO = DAL.CelebritiesDAO;
const jwt = require("jsonwebtoken");
const tokenVerifier = require("./../../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../../Utils/Token/TokenAuthCheck");
const filename = require("path").basename(__filename);
const logger = require("../../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("../../../lib/HelperFunctions").isEmpty;

var returnUnapprovedCelebritiesRoute = express.Router();

returnUnapprovedCelebritiesRoute.post("/api/admin/celebrities/unapproved", tokenVerifier, tokenAuthCheck, function (req, res) {
	try {
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
				logger.fatal(authData);
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
					celebritiesDAO.getAllUnapprovedCelebrities(function (status, message, data) {
						return res.status(status).json({
							"status": {
								"code": status,
								"message": message
							},
							"data": data
						});
					});
				}
			}
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

module.exports = returnUnapprovedCelebritiesRoute;