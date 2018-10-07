const express = require('express');
const DAL = require('../../DAL/index');
const movieRequestVerifier = require('../Movies/AddToMovieRequestVerifier');
const movieDAO = DAL.MovieDAO;
const jwt = require('jsonwebtoken');
const helpers = require("../../Misc/HelperFunctions");
const tokenVerifier = require('./../../Misc/Token/TokenVerifier');
const tokenAuthCheck = require('./../../Misc/Token/TokenAuthCheck');
const md5 = require('md5');
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isEmpty = require('./../../Misc/HelperFunctions').isEmpty;

const addMovieRouter = express.Router();

addMovieRouter.post('/api/movie/add', tokenVerifier, tokenAuthCheck, movieRequestVerifier, function (req, res) {
    try {
        jwt.verify(req.token, process.env.key, function (error, authData) {
            if (error) {
                if (error['name'] == 'TokenExpiredError') return res.status(401).json({
                    "status": {
                        "code": 401,
                        "message": "Token expired"
                    },
                    "data": null
                });
                logger.error("Attempt to login with invalid token");
                return res.status(400).json({
                    "status": {
                        "code": 400,
                        "message": "Invalid token"
                    },
                    "data": null
                });
            } else {
                if (!authData['privilages'].includes('movies')) {
                    return res.status(403).json({
                        "status": {
                            "code": 403,
                            "message": "Insufficient privilages"
                        },
                        "data": null
                    });
                } else {
                    var movieData = req.body;
                    if (isEmpty(movieData.hour)) movieData.hour = 0;
                    if (isEmpty(movieData.minute)) movieData.minute = 0;
                    var movieObject = {
                        _id: movieData.day.toString() + movieData.month.toString() + movieData.year.toString(),
                        title: movieData.title,
                        release_date: new Date(movieData.year, movieData.month, movieData.day, movieData.hour, movieData.minute).toLocaleString('en-US', {
                            timeZone: 'Asia/Calcutta'
                        }),
                        uid: "",
                        artists: movieData.artists,
                        directors: movieData.directors,
                        language: movieData.language,
                        genres: movieData.genres,
                        runtime: movieData.runtime,
                        description: movieData.description,
                        image_provider: movieData.image_provider,
                        image_url: movieData.image_url,
                        referrer_name: movieData.referrer_name,
                        redirect_url: movieData.redirect_url,
                        is_sponsored: movieData.is_sponsored,
                        is_released: false,
                        is_live: movieData.is_live,
                        mpaa_rating: movieData.mpaa_rating,
                        budget: movieData.budget,
                        trivia: movieData.trivia,
                        trailers: movieData.trailers,
                        teasers: movieData.teasers,
                        related_videos: movieData.related_videos,
                        external_ratings: movieData.external_ratings,
                        is_partner_sponsored: false
                    }
                    length = 12 - movieObject._id.length;
                    movieObject._id += helpers.generateNewId(length);
                    var uniqueId = movieObject.title + movieObject.release_date.toString() + movieData.referrerName;
                    uniqueId = uniqueId.replace(/\s/g, '');
                    movieObject.uid = md5(uniqueId);
                    movieObject.genres.sort();
                    movieObject.is_released = helpers.checkDate(movieObject.release_date);
                    movieDAO.addMovie(movieObject, function (status, message, data) {
                        return res.status(status).json({
                            "status": {
                                "code": status,
                                "message": message
                            },
                            "data": data
                        });
                    });
                }
            }
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

module.exports = addMovieRouter;