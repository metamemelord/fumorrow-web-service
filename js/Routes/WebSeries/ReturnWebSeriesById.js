const express = require("express");
const DAL = require("../../DAL/index");
const webSeriesDAOForRetrieval = DAL.WebSeriesDAOForRetrieval;
const webSeriesByIdRouter = express.Router();
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isNotEmpty = require("./../../lib/HelperFunctions").isNotEmpty;

webSeriesByIdRouter.post("/api/web-series/:id", function (req, res) {
	try {
		if (isNotEmpty(req.body._id) || isNotEmpty(req.params.id)) {
			var id = isNotEmpty(req.params.id) ? req.params.id : req.body._id;
			webSeriesDAOForRetrieval.getById(id, function (status, message, data) {
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

module.exports = webSeriesByIdRouter;