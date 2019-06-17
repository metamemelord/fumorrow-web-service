const express = require("express");
const DAL = require("../../DAL/index");
const webSeriesRequestVerifier = require("../WebSeries/AddToWebSeriesRequestVerifier");
const webSeriesDAO = DAL.WebSeriesDAO;
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const tokenVerifier = require("./../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../Utils/Token/TokenAuthCheck");
const md5 = require("md5");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../lib/HelperFunctions").isEmpty;

const addWebSeriesRouter = express.Router();

addWebSeriesRouter.post(
	"/api/web-series/add",
	tokenVerifier,
	tokenAuthCheck,
	webSeriesRequestVerifier,
	function(req, res) {
		try {
			jwt.verify(req.token, process.env.key, function(error, authData) {
				if (error) {
					if (error["name"] == "TokenExpiredError")
						return res.status(401).json({
							status: {
								code: 401,
								message: "Token expired"
							},
							data: null
						});
					logger.error("Attempt to login with invalid token");
					return res.status(400).json({
						status: {
							code: 400,
							message: "Invalid token"
						},
						data: null
					});
				} else {
					if (!authData["privileges"].includes("web-series")) {
						return res.status(403).json({
							status: {
								code: 403,
								message: "Insufficient privileges"
							},
							data: null
						});
					} else {
						var webSeriesData = req.body;
						if (isEmpty(webSeriesData.hour)) webSeriesData.hour = 0;
						if (isEmpty(webSeriesData.minute)) webSeriesData.minute = 0;
						var webSeriesObject = {
							_id:
                webSeriesData.day.toString() +
                webSeriesData.month.toString() +
                webSeriesData.year.toString(),
							title: webSeriesData.title,
							release_date: new Date(
								webSeriesData.year,
								webSeriesData.month - 1,
								webSeriesData.day,
								webSeriesData.hour,
								webSeriesData.minute
							),
							uid: "",
							cast: webSeriesData.cast,
							crew: webSeriesData.crew,
							language: webSeriesData.language,
							subtitles: webSeriesData.subtitles,
							genres: webSeriesData.genres,
							images: webSeriesData.images,
							videos: webSeriesData.videos,
							texts: webSeriesData.texts,
							partners: webSeriesData.partners,
							showing_at: webSeriesData.showing_at,
							is_sponsored: webSeriesData.is_sponsored,
							is_released: false,
							is_live: webSeriesData.is_live,
							is_running_now: webSeriesData.is_running_now,
							tv_pg_rating: webSeriesData.tv_pg_rating,
							external_ratings: webSeriesData.external_ratings
						};
						var length = 12 - webSeriesObject._id.length;
						webSeriesObject._id += helpers.generateSalt(length);
						var uniqueId =
							webSeriesObject.title +
							webSeriesObject.release_date.toString() +
							webSeriesData.referrerName;
						webSeriesObject.uid = md5(uniqueId.replace(/\s/g, ""));
						if (helpers.isNotEmpty(webSeriesObject.genres) &&
							webSeriesObject.genres.constructor === Array)
							webSeriesObject.genres.sort();
						webSeriesObject.is_released = helpers.checkDate(
							webSeriesObject.release_date
						);
						webSeriesDAO.addWebSeries(webSeriesObject, function(
							status,
							message,
							data
						) {
							return res.status(status).json({
								status: {
									code: status,
									message: message
								},
								data: data
							});
						});
					}
				}
			});
		} catch (error) {
			logger.error(error);
			return res.status(500).json({
				status: {
					code: 500,
					message: "Internal server error"
				},
				data: null
			});
		}
	}
);

module.exports = addWebSeriesRouter;
