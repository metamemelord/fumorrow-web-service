const express = require("express");
const DAL = require("../../DAL/index");
const videoGameDAOForRetrieval = DAL.VideoGameDAOForRetrieval;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../Utils/HelperFunctions").isEmpty;
var returnVideoGamesRouter = express.Router();

returnVideoGamesRouter.post("/api/videogames", function (req, res) {
	try {
		if (isEmpty(req.body.begin) || isEmpty(req.body.limit)) {
			if (isEmpty(req.body.filter)) {
				videoGameDAOForRetrieval.getAll(function (status, message, data) {
					return res.status(status).json({
						"status": {
							"code": status,
							"message": message
						},
						"data": data
					});
				});
			} else {
				var filter = req.body.filter;
				videoGameDAOForRetrieval.getAllByFilter(filter, function (status, message, data) {
					return res.status(status).json({
						"status": {
							"code": status,
							"message": message
						},
						"data": data
					});
				});
			}
		} else {
			if (isEmpty(req.body.filter)) {
				videoGameDAOForRetrieval.getInRange(req.body.begin, req.body.limit, function (status, message, data) {
					return res.status(status).json({
						"status": {
							"code": status,
							"message": message
						},
						"data": data
					});
				});
			} else {
				var filterWithRange = req.body.filter;
				videoGameDAOForRetrieval.getInRangeByFilter(filterWithRange, req.body.begin, req.body.limit, function (status, message, data) {
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

module.exports = returnVideoGamesRouter;