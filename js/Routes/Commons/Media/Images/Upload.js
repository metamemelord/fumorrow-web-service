const express = require("express");
const DAL = require("../../../../DAL");
const mediaDAO = DAL.MediaDAO;
const jwt = require("jsonwebtoken");
const tokenVerifier = require("../../../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("../../../../Utils/Token/TokenAuthCheck");
const filename = require("path").basename(__filename);
const logger = require("../../../../Loggers").LoggerFactory.getLogger(filename);
const isEmpty = require("../../../../Utils/HelperFunctions").isEmpty;

const imageUploadRouter = express.Router();

imageUploadRouter.post("/api/admin/res/image/upload", tokenVerifier, tokenAuthCheck, function (req, res) {
	try {
		jwt.verify(req.token, process.env.key, function (error, authData) {
			if (error) {
				if (error["name"] == "TokenExpiredError")
					return res.status(401).json({
						"status": {
							"code": 401,
							"message": "Token expired"
						},
						"data": null
					});
				logger.error("Attempt to login with invalid token");
				return res.status(400).json({
					"status": {
						"code": 400,
						"message": "Invalid token"
					},
					"data": null
				});
			} else {
				var mediaDetails = req.body;
				if (isEmpty(mediaDetails.path) || isEmpty(mediaDetails.category) || isEmpty(mediaDetails.title)) {
					return res.status(400).json({
						"status": {
							"code": 400,
							"message": "Mandatory fields cannot be left blank"
						},
						"data": null
					});
				} else {
					mediaDetails.type = "image";
					mediaDAO.upload(mediaDetails, function (status, message, data) {
						if (status === 201) {
							logger.warn(authData.username + ", uploaded " + data.secure_url);
						}
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

module.exports = imageUploadRouter;