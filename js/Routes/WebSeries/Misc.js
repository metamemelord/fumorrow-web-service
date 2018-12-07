const express = require('express');
const DAL = require('../../DAL/index');
const webSeriesDAO = DAL.WebSeriesDAO;
const webSeriesDAOForRetrieval = DAL.WebSeriesDAOForRetrieval;
const webSeriesMiscRouter = express.Router();
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isNotEmpty = require('./../../Utils/HelperFunctions').isNotEmpty;

webSeriesMiscRouter.post('/api/web-series/inc/:id', function (req, res) {
    try {
        if (isNotEmpty(req.body._id) || isNotEmpty(req.params.id)) {
            var id = isNotEmpty(req.params.id) ? req.params.id : req.body._id;
            webSeriesDAO.incrementCounterById(id, function (status, message, data) {
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

webSeriesMiscRouter.post('/api/web-series/partners', function (req, res) {
    try {
        webSeriesDAOForRetrieval.getAllReferrers(function (status, message, data) {
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

webSeriesMiscRouter.post('/api/web-series/languages', function (req, res) {
    try {
        webSeriesDAOForRetrieval.getAllLanguages(function (status, message, data) {
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

module.exports = webSeriesMiscRouter;