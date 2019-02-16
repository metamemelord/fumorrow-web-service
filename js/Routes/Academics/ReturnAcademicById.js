const express = require("express");
const DAL = require("../../DAL/index");
const academicDAOForRetrieval = DAL.AcademicDAOForRetrieval;
const academicByIdRouter = express.Router();
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isNotEmpty = require("./../../lib/HelperFunctions").isNotEmpty;

academicByIdRouter.post("/api/academic/:id", function (req, res) {
	try {
		if (isNotEmpty(req.body._id) || isNotEmpty(req.params.id)) {
			var id = isNotEmpty(req.params.id) ? req.params.id : req.body._id;
			academicDAOForRetrieval.getById(id, function (status, message, data) {
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

module.exports = academicByIdRouter;