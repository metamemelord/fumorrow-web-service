const express = require("express");
const DAL = require("./../../DAL/index");
const loginDAO = DAL.LoginDAO;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../Utils/HelperFunctions").isEmpty;

var loginRouter = express.Router();

loginRouter.post("/api/admin/login", function (req, res) {
	try {
		if (!(parseInt(process.env.LOGIN_SERVICE_ACTIVE))) {
			return res.status(503).json({
				"status": {
					"code": 503,
					"message": "Login service has been disabled. Please contact the admin."
				},
				"data": null
			});
		}
		if (isEmpty(req.body.username) || isEmpty(req.body.password))
			return res.status(400).json({
				"status": {
					"code": 400,
					"message": "Invalid credentials"
				},
				"data": null
			});
		var userDetails = {
			username: req.body.username.toLowerCase(),
			password: req.body.password
		};
		if (userDetails.username.split(" ").length > 1 || isEmpty(userDetails.password))
			return res.status(400).json({
				"status": {
					"code": 400,
					"message": "Invalid credentials"
				},
				"data": null
			});
		else {
			loginDAO.performLogin(userDetails, (status, message, data) => {
				return res.status(status).json({
					"status": {
						"code": status,
						"message": message
					},
					"data": data
				});
			});
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
});

module.exports = loginRouter;