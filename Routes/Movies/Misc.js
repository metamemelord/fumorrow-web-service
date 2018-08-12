const express = require('express');
const DAL = require('../../DAL/index');
const movieDAO = DAL.MovieDAO;
const movieDAOForRetrieval = DAL.MovieDAOForRetrieval;
const movieMiscRouter = express.Router();
const logger = require('../../Loggers/index').Logger;
const filename = require('path').basename(__filename);
const isNotEmpty = require('./../../Misc/HelperFunctions').isNotEmpty;

movieMiscRouter.post('/api/movie/inc', function (req, res) {

    try {
        if (isNotEmpty(req.body._id)) {
            movieDAO.incrementCounterById(req.body._id, function (status, message, data) {
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
        logger.error(filename + ": " + error);
        return res.sendStatus(304);
    }
});

movieMiscRouter.post('/api/movies/partners', function (req, res) {
    try {
        movieDAOForRetrieval.getAllReferrers(function (status, message, data) {
            return res.status(status).json({
                "status":{
                    "code":status,
                    "message":message
                },
                "data":data
            });
        });
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

movieMiscRouter.post('/api/movies/languages', function (req, res) {
    try {
        movieDAOForRetrieval.getAllLanguages(function (status, message, data) {
            return res.status(status).json({
                "status":{
                    "code":status,
                    "message":message
                },
                "data":data
            });
        });
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

module.exports = movieMiscRouter;