const express = require("express");
const DAL = require("../../DAL/index");
const webSeriesIdVerifier = require("../RouteUtils").requestIdVerifier;
const webSeriesRequestVerifier = require("./AddToWebSeriesRequestVerifier");
const webSeriesDAO = DAL.WebSeriesDAO;
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const tokenVerifier = require("../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("../../Utils/Token/TokenAuthCheck");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("../../lib/HelperFunctions").isEmpty;

const modifyWebSeriesRouter = express.Router();

modifyWebSeriesRouter.post("/api/web-series/modify",
	tokenVerifier,
	tokenAuthCheck,
	webSeriesIdVerifier,
	webSeriesRequestVerifier,
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
					if (!authData["privileges"].includes("web-series")) {
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
						var webSeriesData = req.body;
						if (isEmpty(webSeriesData.hour)) webSeriesData.hour = 0;
						if (isEmpty(webSeriesData.minute)) webSeriesData.minute = 0;
						var webSeriesObject = {
							override_uid_check: webSeriesData.override_uid_check,
							_id: webSeriesData._id,
							title: webSeriesData.title,
							release_date: new Date(webSeriesData.year, webSeriesData.month - 1, webSeriesData.day, webSeriesData.hour, webSeriesData.minute).toLocaleString("en-US", {
								timeZone: "Asia/Calcutta"
							}),
							uid: "",
							cast: webSeriesData.cast,
							crew: webSeriesData.crew,
							language: webSeriesData.language,
							genres: webSeriesData.genres,
							season: webSeriesData.season,
							episodes: webSeriesData.episodes,
							images: webSeriesData.images,
							videos: webSeriesData.videos,
							texts: webSeriesData.texts,
							partners: webSeriesData.partners,
							is_sponsored: webSeriesData.is_sponsored,
							is_released: false,
							is_live: webSeriesData.is_live,
							is_running_now: webSeriesData.is_running_now,
							click_counter: webSeriesData.click_counter,
							tv_pg_rating: webSeriesData.tv_pg_rating,
							external_ratings: webSeriesData.external_ratings,
							predicted_ratings: webSeriesData.predicted_ratings,
							favorited_by: webSeriesData.favorited_by,
							user_visit_info: webSeriesData.user_visit_info
						};
						var uniqueId = webSeriesObject.title + webSeriesObject.release_date.toString() + webSeriesData.referrerName;
						webSeriesObject.uid = md5(uniqueId.replace(/\s/g, ""));
						if (helpers.isNotEmpty(webSeriesObject.genres) &&
							webSeriesObject.genres.constructor === Array)
							webSeriesObject.genres.sort();
						webSeriesObject.is_released = helpers.checkDate(webSeriesObject.release_date);
						webSeriesDAO.modifyWebSeries(webSeriesObject, function (status, message, data) {
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

module.exports = modifyWebSeriesRouter;