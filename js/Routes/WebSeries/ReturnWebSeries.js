const express = require("express");
const DAL = require("../../DAL/index");
const webSeriesDAOForRetrieval = DAL.WebSeriesDAOForRetrieval;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../lib/HelperFunctions").isEmpty;
var webSeriesMoviesRouter = express.Router();

webSeriesMoviesRouter.post("/api/web-series", function (req, res) {
	try {
		if (isEmpty(req.body.begin) || isEmpty(req.body.limit)) {
			if (isEmpty(req.body.filter)) {
				webSeriesDAOForRetrieval.getAll(function (status, message, data) {
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
				webSeriesDAOForRetrieval.getAllByFilter(filter, function (status, message, data) {
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
				webSeriesDAOForRetrieval.getInRange(req.body.begin, req.body.limit, function (status, message, data) {
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
				webSeriesDAOForRetrieval.getInRangeByFilter(filterWithRange, req.body.begin, req.body.limit, function (status, message, data) {
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

module.exports = webSeriesMoviesRouter;