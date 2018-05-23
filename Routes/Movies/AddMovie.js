const express = require('express');
const DAL = require('../../DAL/index');
const movieDAO = DAL.MovieDAO;
const addMovieRouter = express.Router();
const jwt = require('jsonwebtoken');
const helpers = require("../../Misc/HelperFunctions");
const md5 = require('md5');

addMovieRouter.post('/api/movie/add', helpers.tokenVerifier, function (req, res) {
    jwt.verify(req.token, process.env.key, function (err, authData) {
        if (err) {
            console.log(err);
            res.status(401).send("Invalid token");
        } else {
            if (!authData['privilages'].includes('movies')) {
                return res.status(403).send("Insufficient privilages");
            } else {
                var movieData = req.body;
                if (movieData.hour === undefined) movieData.hour = 0;
                if (movieData.minute === undefined) movieData.minute = 0;
                let movieObject = {
                    _id: movieData.day.toString() + movieData.month.toString() + movieData.year.toString(),
                    title: movieData.name,
                    date: new Date(movieData.year, movieData.month - 1, movieData.day, movieData.hour, movieData.minute).toLocaleString('en-US', {
                        timeZone: 'Asia/Calcutta'
                    }),
                    uid: "",
                    artists: movieData.artists,
                    language: movieData.language,
                    genres: movieData.genres,
                    runtime: movieData.runtime,
                    description: movieData.description,
                    imageProvider: movieData.imageProvider,
                    imageUrl: movieData.imageUrl,
                    referrerName: movieData.referrerName,
                    redirectUrl: movieData.redirectUrl,
                    isSponsored: movieData.isSponsored,
                    hasPassed: false,
                    clickCounter: movieData.clickCounter
                }
                length = 12 - movieObject._id.length;
                movieObject._id += helpers.generateNewId(length);
                var uniqueId = movieObject.title + movieObject.date.toString() + movieData.referrerName;
                uniqueId = uniqueId.replace(/\s/g, '');
                movieObject.uid = md5(uniqueId);
                movieObject.genres.sort();
                movieObject.hasPassed = helpers.checkDate(movieObject.date);
                movieDAO.addMovie(movieObject, function (status) {
                    if (status === 201) {
                        res.status(201).send("Success");
                    } else if (status === 409) {
                        res.status(409).send("Entry already exists")
                    } else {
                        res.status(status).send("Internal server error");
                    }
                })
            }
        }
    });

});

module.exports = addMovieRouter;