const express = require("express");
const DAL = require("../../DAL/index");
const movieRequestVerifier = require("../Movies/AddToMovieRequestVerifier");
const movieDAO = DAL.MovieDAO;
const MovieBuilder = require("../../lib/Builders/Category/CategoryBuilderFactory").getBuilder("movie");
const jwt = require("jsonwebtoken");
const tokenVerifier = require("./../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../Utils/Token/TokenAuthCheck");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isNotEmpty = require("../../lib/HelperFunctions").isNotEmpty;

const addMovieRouter = express.Router();

addMovieRouter.post("/api/movie/add", tokenVerifier, tokenAuthCheck, movieRequestVerifier, function (req, res) {
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
				if (!authData["privilages"].includes("movies")) {
					return res.status(403).json({
						"status": {
							"code": 403,
							"message": "Insufficient privilages"
						},
						"data": null
					});
				} else {
					var movieData = req.body;
					let movieObject = new MovieBuilder()
						.setHour(isNotEmpty(movieData.hour) ? movieData.hour : 0)
						.setMinute(isNotEmpty(movieData.minute) ? movieData.minute : 0)
						.setDay(movieData.day)
						.setMonth(movieData.month - 1)
						.setYear(movieData.year)
						.setTitle(movieData.title)
						.setCast(movieData.cast)
						.setCrew(movieData.crew)
						.setLanguage(movieData.language)
						.setGenres(movieData.genres)
						.setRuntime(movieData.runtime)
						.setImages(movieData.images)
						.setVideos(movieData.videos)
						.setTexts(movieData.texts)
						.setPartners(movieData.partners)
						.setShowingAt(movieData.showing_at)
						.setIsSponsored(movieData.is_sponsored)
						.setIsLive(movieData.is_live)
						.setMpaaRating(movieData.mpaa_rating)
						.setBudget(movieData.budget)
						.setExternalRatings(movieData.external_ratings)
						.build();
					movieDAO.addMovie(movieObject, function (status, message, data) {
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

module.exports = addMovieRouter;