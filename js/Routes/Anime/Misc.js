const express = require("express");
const DAL = require("../../DAL/index");
const animeDAO = DAL.AnimeDAO;
const animeDAOForRetrieval = DAL.AnimeDAOForRetrieval;
const animeMiscRouter = express.Router();
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isNotEmpty = require("./../../lib/HelperFunctions").isNotEmpty;

animeMiscRouter.post("/api/anime/inc/:id", function (req, res) {
	try {
		if (isNotEmpty(req.body._id) || isNotEmpty(req.params.id)) {
			var id = isNotEmpty(req.params.id) ? req.params.id : req.body._id;
			animeDAO.incrementCounterById(id, function (status, message, data) {
				return res.status(status).json({
					"status": {
						"code": status,
						"message": message
					},
					"data": data
				});
			});
		}
		else {
			return res.status(400).json({
				"status": {
					"code": 400,
					"message": "Provide an ID before proceeding"
				},
				"data": null
			});
		}
	} catch (error) {
		logger.error(error);
		return res.sendStatus(304);
	}
});

animeMiscRouter.post("/api/anime/partners", function (req, res) {
	try {
		animeDAOForRetrieval.getAllReferrers(function (status, message, data) {
			return res.status(status).json({
				"status": {
					"code": status,
					"message": message
				},
				"data": data
			});
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

animeMiscRouter.post("/api/anime/languages", function (req, res) {
	try {
		animeDAOForRetrieval.getAllLanguages(function (status, message, data) {
			return res.status(status).json({
				"status": {
					"code": status,
					"message": message
				},
				"data": data
			});
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

module.exports = animeMiscRouter;