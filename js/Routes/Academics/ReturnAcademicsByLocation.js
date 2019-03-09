const express = require("express");
const DAL = require("../../DAL/index");
const academicDAOForRetrieval = DAL.AcademicDAOForRetrieval;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../lib/HelperFunctions").isEmpty;
var returnAcademicsRouter = express.Router();

returnAcademicsRouter.post("/api/academics", function (req, res) {
    try {
        const latitude = parseFloat(req.query.lat);
        const longitude = parseFloat(req.query.lon);
        academicDAOForRetrieval.getAllByLocation([latitude, longitude], function (status, message, data) {
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

module.exports = returnAcademicsRouter;