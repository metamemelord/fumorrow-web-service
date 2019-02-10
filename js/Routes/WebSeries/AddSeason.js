const express = require("express");
const DAL = require("../../DAL/index");
const webSeriesDAO = DAL.WebSeriesDAO;
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const seasonRequestVerifier = require("./SeasonAndEpisodeRequestVerifier");
const tokenVerifier = require("./../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../Utils/Token/TokenAuthCheck");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = helpers.isEmpty;

const addSeasonRouter = express.Router();

addSeasonRouter.post(
	"/api/web-series/season/add",
	tokenVerifier,
	tokenAuthCheck,
	seasonRequestVerifier,
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
						var seriesSeasonData = req.body;
						if (isEmpty(seriesSeasonData.hour)) seriesSeasonData.hour = 0;
						if (isEmpty(seriesSeasonData.minute)) seriesSeasonData.minute = 0;
						var seasonObject = {
							title: seriesSeasonData.title,
							release_date: new Date(
								seriesSeasonData.year,
								seriesSeasonData.month - 1,
								seriesSeasonData.day,
								seriesSeasonData.hour,
								seriesSeasonData.minute
							).toLocaleString("en-US", {
								timeZone: "Asia/Calcutta"
							}),
							end_date: seriesSeasonData.end_date,
							season_number: seriesSeasonData.season_number,
							cast: seriesSeasonData.cast,
							crew: seriesSeasonData.crew,
							languages: seriesSeasonData.languages,
							episodes: seriesSeasonData.episodes
								? seriesSeasonData.episodes
								: [],
							subtitles: seriesSeasonData.subtitles,
							runtime: 0,
							seasons: seriesSeasonData.seasons,
							images: seriesSeasonData.images,
							videos: seriesSeasonData.videos,
							texts: seriesSeasonData.texts,
							partners: seriesSeasonData.partners,
							showing_at: seriesSeasonData.showing_at,
							is_sponsored: seriesSeasonData.is_sponsored,
							is_released: false,
							is_live: seriesSeasonData.is_live,
							is_running_now: seriesSeasonData.is_running_now,
							tv_pg_rating: seriesSeasonData.tv_pg_rating,
							external_ratings: seriesSeasonData.external_ratings
						};
						seasonObject.is_released = helpers.checkDate(
							seasonObject.release_date
						);
						let seasonData = {
							_id: seriesSeasonData.series_id,
							data: seasonObject
						};
						webSeriesDAO.addSeason(seasonData, function(status, message, data) {
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
