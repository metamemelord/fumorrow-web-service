const express = require("express");
const DAL = require("../../DAL/index");
const bikeDAO = DAL.BikeDAO;
const bikeDAOForRetrieval = DAL.BikeDAOForRetrieval;
const bikeMiscRouter = express.Router();
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isNotEmpty = require("./../../lib/HelperFunctions").isNotEmpty;

bikeMiscRouter.post("/api/bike/inc", function (req, res) {
	try {
		if (isNotEmpty(req.body._id)) {
			bikeDAO.incrementCounterById(req.body._id, function (status, message, data) {
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

bikeMiscRouter.post("/api/bikes/partners", function (req, res) {
	try {
		bikeDAOForRetrieval.getAllReferrers(function (status, message, data) {
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

module.exports = bikeMiscRouter;