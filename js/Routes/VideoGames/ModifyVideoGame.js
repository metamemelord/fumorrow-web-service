const express = require('express');
const DAL = require('../../DAL/index');
const videoGameRequestVerifier = require('../VideoGames/AddToVideoGameRequestVerifier');
const videoGameDAO = DAL.VideoGameDAO;
const jwt = require('jsonwebtoken');
const helpers = require("../../Misc/HelperFunctions");
const tokenVerifier = require('./../../Misc/Token/TokenVerifier');
const tokenAuthCheck = require('./../../Misc/Token/TokenAuthCheck');
const md5 = require('md5');
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isEmpty = require('./../../Misc/HelperFunctions').isEmpty;

const modifyVideoGameRouter = express.Router();

modifyVideoGameRouter.post('/api/videoGame/add', tokenVerifier, tokenAuthCheck, videoGameRequestVerifier, function (req, res) {
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
                if (!authData['privilages'].includes('videoGames')) {
                    return res.status(403).json({
                        "status": {
                            "code": 403,
                            "message": "Insufficient privilages"
                        },
                        "data": null
                    });
                } else {
                    var videoGameData = req.body;
                    if (isEmpty(videoGameData.hour)) videoGameData.hour = 0;
                    if (isEmpty(videoGameData.minute)) videoGameData.minute = 0;
                    var videoGameObject = {
                        _id: videoGameData._id,
                        title: videoGameData.title,
                        release_date: new Date(videoGameData.year, videoGameData.month, videoGameData.day, videoGameData.hour, videoGameData.minute).toLocaleString('en-US', {
                            timeZone: 'Asia/Calcutta'
                        }),
                        uid: "",
                        directors: videoGameData.directors,
                        image_provider: videoGameData.image_provider,
                        image_url: videoGameData.image_url,
                        composer: videoGameData.composer,
                        engine: videoGameData.engine,
                        writer: videoGameData.writer,
                        designer: videoGameData.designer,
                        developer: videoGameData.developer,
                        series: videoGameData.series,
                        publisher: videoGameData.publisher,
                        platform: videoGameData.platform,
                        genre: videoGameData.genre,
                        summary: videoGameData.summary,
                        modes: videoGameData.modes,
                        awards: videoGameData.awards,
                        trivia: videoGameData.trivia,
                        trailers: videoGameData.trailers,
                        peervideo: videoGameData.peervideo,
                        buy_website: videoGameData.buy_website,
                        description: videoGameData.description,
                        referrer_name: videoGameData.referrer_name,
                        is_sponsored: videoGameData.is_sponsored,
                        is_released: false,
                        is_live: videoGameData.is_live,
                        external_ratings: videoGameData.external_ratings,
                        is_partner_sponsored: false
                    }
                    var uniqueId = videoGameObject.title + videoGameObject.release_date.toString() + videoGameData.referrerName;
                    uniqueId = uniqueId.replace(/\s/g, '');
                    videoGameObject.uid = md5(uniqueId);
                    videoGameObject.genres.sort();
                    videoGameObject.is_released = helpers.checkDate(videoGameObject.release_date);
                    videoGameDAO.modifyVideoGame(videoGameObject, function (status, message, data) {
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

module.exports = modifyVideoGameRouter;