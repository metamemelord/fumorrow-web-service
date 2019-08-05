const express = require("express");
const DAL = require("../../DAL/index");
const academicIdVerifier = require("../RouteUtils").requestIdVerifier;
const academicRequestVerifier = require("./AddToAcademicRequestVerifer");
const academicDAO = DAL.AcademicDAO;
const AcademicBuilder = require("../../lib/Builders/Category/impl/Academics");
const jwt = require("jsonwebtoken");
const tokenVerifier = require("../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("../../Utils/Token/TokenAuthCheck");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("../../lib/HelperFunctions").isEmpty;
const locationApi = require('../../lib/LocationAPI');

const modifyAcademicRouter = express.Router();

modifyAcademicRouter.post("/api/academic/modify",
	tokenVerifier,
	tokenAuthCheck,
	academicIdVerifier,
	academicRequestVerifier,
	function (req, res) {
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
					if (!authData["privileges"].includes("academics")) {
						return res.status(403).json({
							"status": {
								"code": 403,
								"message": "Insufficient privileges"
							},
							"data": null
						});
					} else if (isEmpty(req.body.override_uid_check)) {
						return res.status(400).json({
							"status": {
								"code": 400,
								"message": "Overriding UID check not specified"
							},
							"data": null
						});
					} else {
						var academicData = req.body;
						var academicObject = new AcademicBuilder()
							.setId(academicData._id)
							.setOverrideUidCheck(academicData.override_uid_check)
							.setDeadline(academicData.deadline)
							.setTitle(academicData.title)
							.setCategory(academicData.category)
							.setEligibilities(academicData.eligibilities)
							.setBenefits(academicData.benefits)
							.setAdditionalInfo(academicData.additional_info)
							.setFundingStatus(academicData.funding_status)
							.setImages(academicData.images)
							.setTexts(academicData.texts)
							.setPartners(academicData.partners)
							.setAddresses(academicData.addresses)
							.setType(academicData.type)
							.setIsSponsored(academicData.is_sponsored)
							.setIsLive(academicData.is_live)
							.setClickCounter(academicData.click_counter)
							.setFavoritedBy(academicData.favorited_by)
							.setUserVisitInfo(academicData.user_visit_info);
							
						if (academicData.type && academicData.type.toLowerCase() === "online") {
							academicDAO.addAcademic(academicObject.build(), function (status, message, data) {
								return res.status(status).json({
									"status": {
										"code": status,
										"message": message
									},
									"data": data
								});
							});
						} else {
							locationApi(req.body.addresses[0]).then(
								coordinates => {
									academicObject
										.setCoordinates(coordinates);
									academicDAO.modifyAcademic(academicObject.build(), function (status, message, data) {
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
module.exports = modifyAcademicRouter;
