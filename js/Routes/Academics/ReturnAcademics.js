const express = require("express");
const DAL = require("../../DAL/index");
const academicDAOForRetrieval = DAL.AcademicDAOForRetrieval;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../lib/HelperFunctions").isEmpty;
var returnAcademicsRouter = express.Router();

returnAcademicsRouter.post("/api/academics", function (req, res, next) {
	try {
		if (!(isEmpty(req.query.lat) || isEmpty(req.query.lon))) {
			return next();
		}
		console.log(req.query, !(isEmpty(req.query.lat) || isEmpty(req.query.lon)))
		if (isEmpty(req.body.begin) || isEmpty(req.body.limit)) {
			if (isEmpty(req.body.filter)) {
				academicDAOForRetrieval.getAll(function (status, message, data) {
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
				academicDAOForRetrieval.getAllByFilter(filter, function (status, message, data) {
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
				academicDAOForRetrieval.getInRange(req.body.begin, req.body.limit, function (status, message, data) {
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
				academicDAOForRetrieval.getInRangeByFilter(filterWithRange, req.body.begin, req.body.limit, function (status, message, data) {
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

module.exports = returnAcademicsRouter;