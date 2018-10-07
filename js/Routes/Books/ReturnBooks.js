const express = require('express');
const DAL = require('../../DAL/index');
const bookDAOForRetrieval = DAL.bookDAOForRetrieval;
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isEmpty = require('./../../Misc/HelperFunctions').isEmpty;
var returnBooksRouter = express.Router();

returnBooksRouter.post('/api/books', function (req, res) {
    try {
        if (isEmpty(req.body.begin) || isEmpty(req.body.limit)) {
            if (isEmpty(req.body.filter)) {
                bookDAOForRetrieval.getAll(function (status, message, data) {
                    return res.status(status).json({
                        "status":{
                            "code":status,
                            "message":message
                        },
                        "data":data
                    });
                });
            } else {
                var filter = req.body.filter;
                bookDAOForRetrieval.getAllByFilter(filter, function (status, message, data) {
                    return res.status(status).json({
                        "status":{
                            "code":status,
                            "message":message
                        },
                        "data":data
                    });
                });
            }
        } else {
            if (isEmpty(req.body.filter)) {
                bookDAOForRetrieval.getInRange(req.body.begin, req.body.limit, function (status, message, data) {
                    return res.status(status).json({
                        "status":{
                            "code":status,
                            "message":message
                        },
                        "data":data
                    });
                });
            } else {
                var filterWithRange = req.body.filter;
                bookDAOForRetrieval.getInRangeByFilter(filterWithRange, req.body.begin, req.body.limit, function (status, message, data) {
                    return res.status(status).json({
                        "status":{
                            "code":status,
                            "message":message
                        },
                        "data":data
                    });
                });
            }
        }
    } catch (error) {
        logger.error(filename + ": " + error);
        return res.status(500).json({
            "status":{
                "code":500,
                "message":"Internal server error"
            },
            "data":null
        });
    }
});

module.exports = returnBooksRouter;