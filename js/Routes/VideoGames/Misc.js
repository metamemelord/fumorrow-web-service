const express = require("express");
const DAL = require("../../DAL/index");
const videoGameDAO = DAL.VideoGameDAO;
const videoGameDAOForRetrieval = DAL.VideoGameDAOForRetrieval;
const videoGameMiscRouter = express.Router();
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isNotEmpty = require("./../../lib/HelperFunctions").isNotEmpty;

videoGameMiscRouter.post("/api/videogame/inc/:id", function (req, res) {
	try {
		if (isNotEmpty(req.body._id) || isNotEmpty(req.params.id)) {
			var id = isNotEmpty(req.params.id) ? req.params.id : req.body._id;
			videoGameDAO.incrementCounterById(id, function (status, message, data) {
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

videoGameMiscRouter.post("/api/videogames/partners", function (req, res) {
	try {
		videoGameDAOForRetrieval.getAllReferrers(function (status, message, data) {
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

module.exports = videoGameMiscRouter;