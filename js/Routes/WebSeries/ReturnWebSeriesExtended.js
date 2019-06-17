const express = require("express");
const DAL = require("../../DAL/index");
const webSeriesDAOForRetrieval = DAL.WebSeriesDAOForRetrieval;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../lib/HelperFunctions").isEmpty;
var webSeriesMoviesRouter = express.Router();

webSeriesMoviesRouter.post("/api/web-series", function (req, res, next) {
    try {
        const extended = req.query.extended
        const seasons = req.query.seasons
        if(extended === "true") {
            webSeriesDAOForRetrieval.getAllWithEpisodes(function (status, message, data) {
                return res.status(status).json({
                    "status": {
                        "code": status,
                        "message": message
                    },
                    "data": data
                });
            });
        } else if (seasons === "true") {
            webSeriesDAOForRetrieval.getAllWithSeasons(function (status, message, data) {
                return res.status(status).json({
                    "status": {
                        "code": status,
                        "message": message
                    },
                    "data": data
                });
            });
        } else {
            next();
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