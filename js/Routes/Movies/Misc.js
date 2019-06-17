const express = require("express");
const DAL = require("../../DAL/index");
const movieDAO = DAL.MovieDAO;
const movieDAOForRetrieval = DAL.MovieDAOForRetrieval;
const movieMiscRouter = express.Router();
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isNotEmpty = require("./../../lib/HelperFunctions").isNotEmpty;

movieMiscRouter.post("/api/movie/inc/:id", function (req, res) {

	try {
		if (isNotEmpty(req.body._id) || isNotEmpty(req.params.id)) {
			var id = isNotEmpty(req.params.id) ? req.params.id : req.body._id;
			movieDAO.incrementCounterById(id, function (status, message, data) {
				return res.status(status).json({
					"status":{
						"code":status,
						"message":message
					},
					"data":data
				});
			});
		}
		else {
			return res.status(400).json({
				"status":{
					"code":400,
					"message":"Provide an ID before proceeding"
				},
				"data":null
			});
		}
	} catch (error) {
		logger.error(error);
		return res.sendStatus(304);
	}
});

movieMiscRouter.post("/api/movies/partners", function (req, res) {
	try {
		movieDAOForRetrieval.getAllReferrers(function (status, message, data) {
			return res.status(status).json({
				"status":{
					"code":status,
					"message":message
				},
				"data":data
			});
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			"status":{
				"code":500,
				"message":"Internal server error"
			},
			"data":null
		});
	}
});

movieMiscRouter.post("/api/movies/languages", function (req, res) {
	try {
		movieDAOForRetrieval.getAllLanguages(function (status, message, data) {
			return res.status(status).json({
				"status":{
					"code":status,
					"message":message
				},
				"data":data
			});
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			"status":{
				"code":500,
				"message":"Internal server error"
			},
			"data":null
		});
	}
});

module.exports = movieMiscRouter;