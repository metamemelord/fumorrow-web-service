const express = require("express");
const DAL = require("../../DAL/index");
const frontendDAOForRetrieval = DAL.FrontendDAOForRetrieval;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../lib/HelperFunctions").isEmpty;

var returnfrontendRouter = express.Router();

returnfrontendRouter.post(
    "/api/frontend",
    function (req, res) {
        try {
            frontendDAOForRetrieval.getAll(function (status, message, data) {
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

    module.exports = returnfrontendRouter;