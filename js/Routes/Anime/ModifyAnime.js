const express = require("express");
const DAL = require("../../DAL/index");
const animeIdVerifier = require("../RouteUtils").requestIdVerifier;
const animeRequestVerifier = require("./AddToAnimeRequestVerifier");
const animeDAO = DAL.AnimeDAO;
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const helpers = require("../../Utils/HelperFunctions");
const tokenVerifier = require("../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("../../Utils/Token/TokenAuthCheck");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("../../Utils/HelperFunctions").isEmpty;

const modifyAnimeRouter = express.Router();

modifyAnimeRouter.post("/api/anime/modify",
	tokenVerifier,
	tokenAuthCheck,
	animeIdVerifier,
	animeRequestVerifier,
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
					if (!authData["privilages"].includes("anime")) {
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
						var animeData = req.body;
						if (isEmpty(animeData.hour)) animeData.hour = 0;
						if (isEmpty(animeData.minute)) animeData.minute = 0;
						var animeObject = {
							override_uid_check: animeData.override_uid_check,
							_id: animeData._id,
							title: animeData.title,
							release_date: new Date(animeData.year, animeData.month - 1, animeData.day, animeData.hour, animeData.minute).toLocaleString("en-US", {
								timeZone: "Asia/Calcutta"
							}),
							anime_type: animeData.anime_type,
							uid: "",
							cast: animeData.cast,
							crew: animeData.crew,
							language: animeData.language,
							genres: animeData.genres,
							season: animeData.season,
							episodes: animeData.episodes,
							images: animeData.images,
							videos: animeData.videos,
							texts: animeData.texts,
							partners: animeData.partners,
							is_sponsored: animeData.is_sponsored,
							is_released: false,
							is_live: animeData.is_live,
							click_counter: animeData.click_counter,
							is_running_now: animeData.is_running_now,
							tv_pg_rating: animeData.tv_pg_rating,
							external_ratings: animeData.external_ratings,
							predicted_ratings: animeData.predicted_ratings,
							favorited_by: animeData.favorited_by,
							user_visit_info: animeData.user_visit_info
						};
						var uniqueId = animeObject.title + animeObject.release_date.toString() + animeData.referrerName;
						animeObject.uid = md5(uniqueId.replace(/\s/g, ""));
						animeObject.genres.sort();
						animeObject.is_released = helpers.checkDate(animeObject.release_date);
						animeDAO.modifyAnime(animeObject, function (status, message, data) {
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

module.exports = modifyAnimeRouter;