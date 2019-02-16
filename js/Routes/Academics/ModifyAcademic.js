const express = require("express");
const DAL = require("../../DAL/index");
const academicIdVerifier = require("../RouteUtils").requestIdVerifier;
const academicRequestVerifier = require("./AddToAcademicRequestVerifer");
const academicDAO = DAL.AcademicDAO;
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const tokenVerifier = require("../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("../../Utils/Token/TokenAuthCheck");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("../../lib/HelperFunctions").isEmpty;

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
					if (!authData["privilages"].includes("academics")) {
						return res.status(403).json({
							"status": {
								"code": 403,
								"message": "Insufficient privilages"
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
						if (isEmpty(academicData.hour)) academicData.hour = 0;
						if (isEmpty(academicData.minute)) academicData.minute = 0;
						var academicObject = {
							override_uid_check: academicData.override_uid_check,
							_id: academicData._id,
							title: academicData.title,
							release_date: new Date(academicData.year, academicData.month - 1, academicData.day, academicData.hour, academicData.minute).toLocaleString("en-US", {
								timeZone: "Asia/Calcutta"
							}),
							uid: "",
							category: academicData.category,
							qualification: academicData.qualification,
							funding_status: academicData.funding_status,
							images: academicData.images,
							texts: academicData.texts,
							partners: academicData.partners,
							is_sponsored: academicData.is_sponsored,
							is_released: false,
							is_live: academicData.is_live,
							click_counter: academicData.click_counter,
							favorited_by: academicData.favorited_by,
							user_visit_info: academicData.user_visit_info
						};
						var uniqueId = academicObject.title + academicObject.release_date.toString() + academicData.referrerName;
						academicObject.uid = md5(uniqueId.replace(/\s/g, ""));
						academicObject.genres.sort();
						academicObject.is_released = helpers.checkDate(academicObject.release_date);
						academicDAO.modifyAcademic(academicObject, function (status, message, data) {
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

module.exports = modifyAcademicRouter;
