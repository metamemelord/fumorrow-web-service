const express = require('express');
const DAL = require('../../DAL/index');
const movieDAOForRetrieval = DAL.MovieDAOForRetrieval;
var returnMoviesRouter = express.Router();

returnMoviesRouter.post('/api/movies', function (req, res) {
    try {
        if (req.body.begin === undefined && req.body.limit === undefined) {
            if (req.body.filter === undefined || req.body.filter.length === 0) {
                movieDAOForRetrieval.getAll(function (data) {
                    res.status(200).json(data);
                });
            } else {
                var filter = req.body.filter;
                movieDAOForRetrieval.getAllByFilter(filter, function (data) {
                    res.status(200).json(data);
                });
            }
        } else {
            if (req.body.filter === undefined || req.body.filter.length === 0) {
                movieDAOForRetrieval.getInRange(req.body.begin, req.body.limit, function (data) {
                    res.status(200).json(data);
                });
            } else {
                var filterWithRange = req.body.filter;
                movieDAOForRetrieval.getInRangeByFilter(filterWithRange, req.body.begin, req.body.limit, function (data) {
                    res.status(200).json(data);
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

module.exports = returnMoviesRouter;