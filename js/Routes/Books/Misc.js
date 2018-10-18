const express = require('express');
const DAL = require('../../DAL/index');
const bookDAO = DAL.bookDAO;
const bookDAOForRetrieval = DAL.bookDAOForRetrieval;
const bookMiscRouter = express.Router();
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isNotEmpty = require('./../../Utils/HelperFunctions').isNotEmpty;

bookMiscRouter.post('/api/book/inc', function (req, res) {
    try {
        if (isNotEmpty(req.body._id)) {
            bookDAO.incrementCounterById(req.body._id, function (status, message, data) {
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

bookMiscRouter.post('/api/books/partners', function (req, res) {
    try {
        bookDAOForRetrieval.getAllReferrers(function (status, message, data) {
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

bookMiscRouter.post('/api/books/languages', function (req, res) {
    try {
        bookDAOForRetrieval.getAllLanguages(function (status, message, data) {
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

module.exports = bookMiscRouter;