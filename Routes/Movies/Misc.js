const express = require('express');
const DAL = require('../../DAL/index');
const movieDAO = DAL.MovieDAO;
const movieDAOForRetrieval = DAL.MovieDAOForRetrieval;
const movieMiscRouter = express.Router();

movieMiscRouter.post('/api/movie/inc', function (req, res) {

    try {
        if (req.body.id !== undefined) {
            movieDAO.incrementCounterById(req.body.id, function (status) {
                if (status === 200) {
                    return res.status(200).send("Increment successful");
                } else if (status === 412) {
                    return res.status(412).send("Invalid ID");
                } else if (status === 500) {
                    return res.status(500).send("Internal error");
                } else {
                    return res.status(404).send("Content not found on the server");
                }
            });
        }
        else {
            return res.status(400).send("Provide an ID before proceeding");
        }
    } catch (error) {
        console.log(error);
        return res.status(304).send("Unmodified");
    }
});

movieMiscRouter.post('/api/movies/partners', function (req, res) {

    try {
        movieDAOForRetrieval.getAllReferrers(function (data) {
            if (data !== null) return res.status(200).json(data);
            else return res.status(204).send("No data");
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Unknown server error");
    }
});

movieMiscRouter.post('/api/movies/languages', function (req, res) {
    try {
        movieDAOForRetrieval.getAllLanguages(function (data) {
            if (data !== null) return res.status(200).json(data);
            else return res.status(204).send("No data");
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Unknown server error");
    }
});

module.exports = movieMiscRouter;