const express = require('express');
const DAL = require('../../DAL/index');
const animeRequestVerifier = require('../Anime/AddToAnimeRequestVerifier');
const animeDAO = DAL.AnimeDAO;
const jwt = require('jsonwebtoken');
const helpers = require("../../Utils/HelperFunctions");
const tokenVerifier = require('../../Utils/Token/TokenVerifier');
const tokenAuthCheck = require('../../Utils/Token/TokenAuthCheck');
const md5 = require('md5');
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isEmpty = require('../../Utils/HelperFunctions').isEmpty;

const addAnimeRouter = express.Router();

addAnimeRouter.post('/api/anime/add', tokenVerifier, tokenAuthCheck, animeRequestVerifier, function (req, res) {
    try {
        jwt.verify(req.token, process.env.key, function (error, authData) {
            if (error) {
                if (error['name'] == 'TokenExpiredError')
                    return res.status(401).json({
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
                if (!authData['privilages'].includes('anime')) {
                    return res.status(403).json({
                        "status": {
                            "code": 403,
                            "message": "Insufficient privilages"
                        },
                        "data": null
                    });
                } else {
                    var animeData = req.body;
                    if (isEmpty(animeData.hour)) animeData.hour = 0;
                    if (isEmpty(animeData.minute)) animeData.minute = 0;
                    var animeObject = {
                        _id: animeData.day.toString() + animeData.month.toString() + animeData.year.toString(),
                        title: animeData.title,
                        release_date: new Date(animeData.year, animeData.month, animeData.day, animeData.hour, animeData.minute).toLocaleString('en-US', {
                            timeZone: 'Asia/Calcutta'
                        }),
                        uid: "",
                        cast: animeData.cast,
                        crew: animeData.crew,
                        language: animeData.language,
                        genres: animeData.genres,
                        runtime: animeData.runtime,
                        images: animeData.images,
                        videos: animeData.videos,
                        texts: animeData.texts,
                        partners: animeData.partners,
                        showing_at: animeData.showing_at,
                        is_sponsored: animeData.is_sponsored,
                        is_released: false,
                        is_live: animeData.is_live,
                        mpaa_rating: animeData.mpaa_rating,
                        budget: animeData.budget,
                        external_ratings: animeData.external_ratings,
                    }
                    length = 12 - animeObject._id.length;
                    animeObject._id += helpers.generateSalt(length);
                    var uniqueId = animeObject.title + animeObject.release_date.toString() + animeData.referrerName;
                    animeObject.uid = md5(uniqueId.replace(/\s/g, ''));
                    animeObject.genres.sort();
                    animeObject.is_released = helpers.checkDate(animeObject.release_date);
                    animeDAO.addAnime(animeObject, function (status, message, data) {
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

module.exports = addAnimeRouter;