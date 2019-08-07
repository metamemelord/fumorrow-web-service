const express = require("express");
const DAL = require("../../DAL/index");
const movieDAOForRetrieval = DAL.MovieDAOForRetrieval;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../lib/HelperFunctions").isEmpty;
var returnMoviesRouter = express.Router();

returnMoviesRouter.post("/api/movies", function (req, res) {
	try {
		const limitQuery = req.query.lt;
		const beginQuery = req.query.bg;
		const limit = isEmpty(limitQuery) || parseInt(limitQuery) === 'NaN' ? 0 : Math.abs(parseInt(limitQuery));
		const begin = isEmpty(beginQuery) || parseInt(beginQuery) === 'NaN' ? 0 : Math.abs(parseInt(beginQuery));

		if (isEmpty(req.body.filter)) {
			movieDAOForRetrieval.getInRange(begin, limit, function (status, message, data) {
				return res.status(status).json({
					"status": {
						"code": status,
						"message": message
					},
					"data": data
				});
			});
		} else {
			var filter = req.body.filter.map(el => {
				if (typeof el === 'string') {
					el.toLowerCase();
				}
				return el;
			});
			movieDAOForRetrieval.getInRangeByFilter(filter, begin, limit, function (status, message, data) {
				return res.status(status).json({
					"status": {
						"code": status,
						"message": message
					},
					"data": data
				});
			});
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