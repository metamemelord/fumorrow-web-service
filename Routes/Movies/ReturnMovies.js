const express = require('express');
const DAL = require('../../DAL/index');
const movieDAO = DAL.MovieDAO;
var returnMoviesRouter = express.Router();

returnMoviesRouter.post('/api/movies', function (req, res) {
    try {
        if (req.body.begin === undefined && req.body.limit === undefined) {
            if (req.body.filter === undefined || req.body.filter.length === 0) {
                movieDAO.getAll(function (data) {
                    res.status(200).json(data);
                });
            } else {
                var filter = req.body.filter;
                movieDAO.getAllByFilter(filter, function (data) {
                    res.status(200).json(data);
                });
            }
        } else {
            if (req.body.filter === undefined || req.body.filter.length === 0) {
                movieDAO.getInRange(req.body.begin, req.body.limit, function (data) {
                    res.status(200).json(data);
                });
            } else {
                var filterWithRange = req.body.filter;
                movieDAO.getInRangeByFilter(filterWithRange, req.body.begin, req.body.limit, function (data) {
                    res.status(200).json(data);
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Invalid request");
    }
});

module.exports = returnMoviesRouter;