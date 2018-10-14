const express = require('express');
const DAL = require('../../DAL/index');
const bikeRequestVerifier = require('../Bikes/AddToBikeRequestVerifier');
const bikeDAO = DAL.BikeDAO;
const jwt = require('jsonwebtoken');
const helpers = require("../../Misc/HelperFunctions");
const tokenVerifier = require('./../../Misc/Token/TokenVerifier');
const tokenAuthCheck = require('./../../Misc/Token/TokenAuthCheck');
const md5 = require('md5');
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isEmpty = require('./../../Misc/HelperFunctions').isEmpty;

const addBikeRouter = express.Router();

addBikeRouter.post('/api/bike/add', tokenVerifier, tokenAuthCheck, bikeRequestVerifier, function (req, res) {
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
                if (!authData['privilages'].includes('bikes')) {
                    return res.status(403).json({
                        "status": {
                            "code": 403,
                            "message": "Insufficient privilages"
                        },
                        "data": null
                    });
                } else {
                    var bikeData = req.body;
                    if (isEmpty(bikeData.hour)) bikeData.hour = 0;
                    if (isEmpty(bikeData.minute)) bikeData.minute = 0;
                    if (isEmpty(bikeData.day)) bikeData.day = 0;
                    var bikeObject = {
                        _id: bikeData.day.toString() + bikeData.month.toString() + bikeData.year.toString(),
                        bike_name: bikeData.bike_name,
                        release_date: new Date(bikeData.year, bikeData.month, bikeData.day, bikeData.hour, bikeData.minute).toLocaleString('en-US', {
                            timeZone: 'Asia/Calcutta'
                        }),
                        uid: "",
                        brand_name: bikeData.brand_name,
                        bike_type: bikeData.bike_type,
                        price: bikeData.price,
                        colors: bikeData.colors,
                        mileage: bikeData.mileage,
                        engine_displacement: bikeData.engine_displacement,
                        headlamps: bikeData.headlamps,
                        tyre_type: bikeData.tyre_type,
                        power: bikeData.power,
                        gear_box: bikeData.gear_box,
                        ABS: bikeData.ABS,
                        wheel_type: bikeData.wheel_type,
                        top_speed: bikeData.top_speed,
                        related_videos: bikeData.related_videos,
                        related_bikes: bikeData.related_bikes,
                        description: bikeData.description,
                        key_features: bikeData.key_features,
                        image_provider: bikeData.image_provider,
                        image_url: bikeData.image_url,
                        referrer_name: bikeData.referrer_name,
                        redirect_url: bikeData.redirect_url,
                        is_sponsored: bikeData.is_sponsored,
                        is_released: false,
                        is_live: bikeData.is_live,
                        external_ratings: bikeData.external_ratings,
                        is_partner_sponsored: bikeData.is_partner_sponsored,
                        is_sponsored_banner: bikeData.is_sponsored_banner
                    }
                    var uniqueId = bikeObject.bike_name + bikeObject.release_date.toString() + bikeData.brand_name;
                    uniqueId = uniqueId.replace(/\s/g, '');
                    bikeObject.uid = md5(uniqueId);
                    bikeObject.is_released = helpers.checkDate(bikeObject.release_date);
                    bikeDAO.addBike(bikeObject, function (status, message, data) {
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

module.exports = addBikeRouter;