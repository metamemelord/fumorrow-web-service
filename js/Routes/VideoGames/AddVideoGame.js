const express = require("express");
const DAL = require("../../DAL/index");
const videoGameRequestVerifier = require("../VideoGames/AddToVideoGameRequestVerifier");
const videoGameDAO = DAL.VideoGameDAO;
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const tokenVerifier = require("./../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../Utils/Token/TokenAuthCheck");
const md5 = require("md5");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = helpers.isEmpty;

const addVideoGameRouter = express.Router();

addVideoGameRouter.post("/api/videogame/add", tokenVerifier, tokenAuthCheck, videoGameRequestVerifier, function (req, res) {
	try {
		jwt.verify(req.token, process.env.key, function (error, authData) {
			if (error) {
				if (error["name"] == "TokenExpiredError") return res.status(401).json({
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
				if (!authData["privilages"].includes("video_games")) {
					return res.status(403).json({
						"status": {
							"code": 403,
							"message": "Insufficient privilages"
						},
						"data": null
					});
				} else {
					var videoGameData = req.body;
					if (isEmpty(videoGameData.hour)) videoGameData.hour = 0;
					if (isEmpty(videoGameData.minute)) videoGameData.minute = 0;
					var videoGameObject = {
						_id: videoGameData.day.toString() + videoGameData.month.toString() + videoGameData.year.toString(),
						title: videoGameData.title,
						release_date: new Date(videoGameData.year, videoGameData.month - 1, videoGameData.day, videoGameData.hour, videoGameData.minute).toLocaleString("en-US", {
							timeZone: "Asia/Calcutta"
						}),
						uid: "",
						directors: videoGameData.directors,
						composers: videoGameData.composers,
						engine: videoGameData.engine,
						writers: videoGameData.writers,
						designers: videoGameData.designers,
						developers: videoGameData.developers,
						series: videoGameData.series,
						platforms: videoGameData.platforms,
						genres: videoGameData.genres,
						modes: videoGameData.modes,
						images: videoGameData.images,
						videos: videoGameData.videos,
						texts: videoGameData.texts,
						partners: videoGameData.partners,
						awards: videoGameData.awards,
						is_sponsored: videoGameData.is_sponsored,
						is_released: false,
						is_live: videoGameData.is_live,
						external_ratings: videoGameData.external_ratings
					};
					var length = 12 - videoGameObject._id.length;
					videoGameObject._id += helpers.generateSalt(length);
					var uniqueId = videoGameObject.title + videoGameObject.release_date.toString() + videoGameData.referrerName;
					uniqueId = uniqueId.replace(/\s/g, "");
					videoGameObject.uid = md5(uniqueId);
					if (helpers.isNotEmpty(videoGameObject.genres) &&
						videoGameObject.genres.constructor === Array)
						videoGameObject.genres.sort();
					videoGameObject.is_released = helpers.checkDate(videoGameObject.release_date);
					videoGameDAO.addVideoGame(videoGameObject, function (status, message, data) {
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

module.exports = addVideoGameRouter;
