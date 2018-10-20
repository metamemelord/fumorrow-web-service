const express = require('express');
const DAL = require('../../DAL/index');
const carRequestVerifier = require('../Cars/AddToCarRequestVerifier');
const carDAO = DAL.CarDAO;
const jwt = require('jsonwebtoken');
const helpers = require("../../Misc/HelperFunctions");
const tokenVerifier = require('./../../Misc/Token/TokenVerifier');
const tokenAuthCheck = require('./../../Misc/Token/TokenAuthCheck');
const md5 = require('md5');
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isEmpty = require('./../../Misc/HelperFunctions').isEmpty;

const addCarRouter = express.Router();

addCarRouter.post('/api/car/add', tokenVerifier, tokenAuthCheck, carRequestVerifier, function (req, res) {
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
                if (!authData['privilages'].includes('cars')) {
                    return res.status(403).json({
                        "status": {
                            "code": 403,
                            "message": "Insufficient privilages"
                        },
                        "data": null
                    });
                } else {
                    var carData = req.body;
                    if (isEmpty(carData.hour)) carData.hour = 0;
                    if (isEmpty(carData.minute)) carData.minute = 0;
                    if (isEmpty(carData.day)) carData.day = 0;
                    var carObject = {
                        _id: carData.day.toString() + carData.month.toString() + carData.year.toString(),
                        car_name: carData.car_name,
                        release_date: new Date(carData.year, carData.month, carData.day, carData.hour, carData.minute).toLocaleString('en-US', {
                            timeZone: 'Asia/Calcutta'
                        }),
                        uid: "",
                        brand_name: carData.brand_name,
                        car_type: carData.car_type,
                        price: carData.price,
                        colors: carData.colors,
                        mileage: carData.mileage,
                        engine_displacement: carData.engine_displacement,
                        tyre_type: carData.tyre_type,
                        transmission: carData.transmission,
                        top_speed: carData.top_speed,
                        fuel_type: carData.fuel_type,
                        boot_space: carData.boot_space,
                        power_windows: carData.power_windows,
                        airbags: carData.airbags,
                        ABS: carData.ABS,
                        centrallocking: carData.centrallocking,
                        foglamps: carData.foglamps,
                        videos: carData.videos,
                        video_credits: carData.video_credits,
                        related_cars: carData.related_cars,
                        description: carData.description,
                        key_features: carData.key_features,
                        image_provider: carData.image_provider,
                        image_url: carData.image_url,
                        referrer_name: carData.referrer_name,
                        redirect_url: carData.redirect_url,
                        is_sponsored: carData.is_sponsored,
                        is_released: false,
                        is_live: carData.is_live,
                        external_ratings: carData.external_ratings,
                        is_partner_sponsored: carData.is_partner_sponsored,
                        is_sponsored_banner: carData.is_sponsored_banner
                    }
                    length = 12 - bookObject._id.length;
                    bookObject._id += helpers.generateNewId(length);
                    var uniqueId = carObject.car_name + carObject.release_date.toString() + carData.brand_name;
                    uniqueId = uniqueId.replace(/\s/g, '');
                    carObject.uid = md5(uniqueId);
                    carObject.is_released = helpers.checkDate(carObject.release_date);
                    carDAO.addCar(carObject, function (status, message, data) {
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

module.exports = addCarRouter;