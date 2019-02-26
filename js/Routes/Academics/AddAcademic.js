const express = require("express");
const DAL = require("../../DAL/index");
const academicRequestVerifier = require("../Academics/AddToAcademicRequestVerifer");
const academicDAO = DAL.AcademicDAO;
const AcademicBuilder = require("../../lib/Builders/Category/impl/Academics");
const jwt = require("jsonwebtoken");
const tokenVerifier = require("./../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../Utils/Token/TokenAuthCheck");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const helpers = require("../../lib/HelperFunctions");
const isNotEmpty = helpers.isNotEmpty;
const locationApi = require("../../lib/LocationAPI");

const addAcademicRouter = express.Router();

addAcademicRouter.post("/api/academic/add", tokenVerifier, tokenAuthCheck, academicRequestVerifier, function (req, res) {
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
				if (!authData["privilages"].includes("academics")) {
					return res.status(403).json({
						"status": {
							"code": 403,
							"message": "Insufficient privilages"
						},
						"data": null
					});
				} else {
					var academicData = req.body;
					var academicObject = new AcademicBuilder()
						.setHour(isNotEmpty(academicData.hour) ? academicData.hour : 0)
						.setMinute(isNotEmpty(academicData.minute) ? academicData.minute : 0)
						.setDay(academicData.day)
						.setMonth(academicData.month - 1)
						.setYear(academicData.year)
						.setTitle(academicData.title)
						.setCategory(academicData.category)
						.setQualification(academicData.qualification)
						.setFundingStatus(academicData.funding_status)
						.setImages(academicData.images)
						.setTexts(academicData.texts)
						.setPartners(academicData.partners)
						.setAddress(academicData.address)
						.setIsSponsored(academicData.is_sponsored)
						.setIsLive(academicData.is_live);

					locationApi(req.body.address).then(
						coordinates => {
							academicObject
								.setCoordinates(coordinates);
							academicDAO.addAcademic(academicObject.build(), function (status, message, data) {
								return res.status(status).json({
									"status": {
										"code": status,
										"message": message
									},
									"data": data
								});
							});
						}
					).catch(error => {
						logger.error(error);
						return res.status(404).json({
							"status": {
								"code": 404,
								"message": "Could not find address"
							},
							"data": null
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

module.exports = addAcademicRouter;
