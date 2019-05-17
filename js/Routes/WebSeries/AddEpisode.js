const express = require("express");
const DAL = require("../../DAL/index");
const webSeriesDAO = DAL.WebSeriesDAO;
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const episodeRequestVerifier = require("./SeasonAndEpisodeRequestVerifier");
const tokenVerifier = require("./../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../Utils/Token/TokenAuthCheck");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = helpers.isEmpty;

const addSeasonRouter = express.Router();

addSeasonRouter.post(
	"/api/web-series/season/add-episode",
	tokenVerifier,
	tokenAuthCheck,
	episodeRequestVerifier,
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
					if (!authData["privilages"].includes("web-series")) {
						return res.status(403).json({
							status: {
								code: 403,
								message: "Insufficient privilages"
							},
							data: null
						});
					} else {
						if (isEmpty(req.body.episode_number)) {
							return res.status(400).json({
								status: {
									code: 400,
									message: "Episode number cannot be blank"
								},
								data: null
							});
						}
						var seriesEpisodeData = req.body;
						if (isEmpty(seriesEpisodeData.hour)) seriesEpisodeData.hour = 0;
						if (isEmpty(seriesEpisodeData.minute)) seriesEpisodeData.minute = 0;
						var episodeObject = {
							title: seriesEpisodeData.title,
							release_date: new Date(
								seriesEpisodeData.year,
								seriesEpisodeData.month - 1,
								seriesEpisodeData.day,
								seriesEpisodeData.hour,
								seriesEpisodeData.minute
							),
							episode_number: seriesEpisodeData.episode_number,
							cast: seriesEpisodeData.cast,
							crew: seriesEpisodeData.crew,
							languages: seriesEpisodeData.languages,
							runtime: seriesEpisodeData.runtime
								? seriesEpisodeData.runtime
								: 0,
							subtitles: seriesEpisodeData.subtitles,
							images: seriesEpisodeData.images,
							videos: seriesEpisodeData.videos,
							texts: seriesEpisodeData.texts,
							partners: seriesEpisodeData.partners,
							showing_at: seriesEpisodeData.showing_at,
							is_sponsored: seriesEpisodeData.is_sponsored,
							is_released: false,
							is_live: seriesEpisodeData.is_live,
							is_running_now: seriesEpisodeData.is_running_now,
							tv_pg_rating: seriesEpisodeData.tv_pg_rating,
							external_ratings: seriesEpisodeData.external_ratings
						};
						episodeObject.is_released = helpers.checkDate(
							episodeObject.release_date
						);
						let episodeData = {
							_id: seriesEpisodeData.series_id,
							season_number: seriesEpisodeData.season_number,
							data: episodeObject
						};
						webSeriesDAO.addEpisode(episodeData, function(
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

module.exports = addSeasonRouter;
