const express = require("express");
const DAL = require("../../DAL/index");
const webSeriesDAO = DAL.WebSeriesDAO;
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const seasonRequestVerifier = require("./SeasonRequestVerifier");
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
					if (!authData["privileges"].includes("web-series")) {
						return res.status(403).json({
							status: {
								code: 403,
								message: "Insufficient privileges"
							},
							data: null
						});
					} else {
						var seriesSeasonData = req.body;
						var seasonObject = {
							start_date: new Date(seriesSeasonData.start_date),
							end_date: seriesSeasonData.end_date,
							subtitles: seriesSeasonData.subtitles,
							series_id: seriesSeasonData.series_id,
							season_number: seriesSeasonData.season_number,
							snapshot: seriesSeasonData.snapshot,
							cast: seriesSeasonData.cast,
							crew: seriesSeasonData.crew,
							language: seriesSeasonData.language,
							images: seriesSeasonData.images,
							videos: seriesSeasonData.videos,
							texts: seriesSeasonData.texts,
							partners: seriesSeasonData.partners,
							showing_at: seriesSeasonData.showing_at,
							tv_pg_rating: seriesSeasonData.tv_pg_rating,
							external_ratings: seriesSeasonData.external_ratings,
							is_sponsored: seriesSeasonData.is_sponsored,
							is_approved: true
						};
						seasonObject.is_released = helpers.checkDate(
							seasonObject.release_date
						);
						webSeriesDAO.addSeason(seasonObject, function(status, message, data) {
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
