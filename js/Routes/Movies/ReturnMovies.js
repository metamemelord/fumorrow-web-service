const express = require("express");
const DAL = require("../../DAL/index");
const movieDAOForRetrieval = DAL.MovieDAOForRetrieval;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../lib/HelperFunctions").isEmpty;
var returnMoviesRouter = express.Router();

returnMoviesRouter.post("/api/movies", function (req, res) {
	try {
		if (isEmpty(req.body.begin) || isEmpty(req.body.limit)) {
			if (isEmpty(req.body.filter)) {
				movieDAOForRetrieval.getAll(function (status, message, data) {
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
				movieDAOForRetrieval.getAllByFilter(filter, function (status, message, data) {
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
				movieDAOForRetrieval.getInRange(req.body.begin, req.body.limit, function (status, message, data) {
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
				movieDAOForRetrieval.getInRangeByFilter(filterWithRange, req.body.begin, req.body.limit, function (status, message, data) {
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

module.exports = returnMoviesRouter;