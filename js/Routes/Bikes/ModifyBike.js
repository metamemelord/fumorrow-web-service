const express = require("express");
const DAL = require("../../DAL/index");
const bikeIdVerifier = require("../RouteUtils").requestIdVerifier;
const bikeRequestVerifier = require("../Bikes/AddToBikeRequestVerifier");
const bikeDAO = DAL.BikeDAO;
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const tokenVerifier = require("./../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../Utils/Token/TokenAuthCheck");
const md5 = require("md5");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../lib/HelperFunctions").isEmpty;

const modifyBikeRouter = express.Router();

modifyBikeRouter.post("/api/bike/modify",
	tokenVerifier,
	tokenAuthCheck,
	bikeIdVerifier,
	bikeRequestVerifier,
	function (req, res) {
		try {
			jwt.verify(req.token, process.env.key, function (error, authData) {
				if (error) {
					if (error["name"] == "TokenExpiredError")
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
					if (!authData["privilages"].includes("bikes")) {
						return res.status(403).json({
							"status": {
								"code": 403,
								"message": "Insufficient privilages"
							},
							"data": null
						});
					} else if (isEmpty(req.body.override_uid_check)) {
						return res.status(400).json({
							"status": {
								"code": 400,
								"message": "Overriding UID check not specified"
							},
							"data": null
						});
					} else {
						var bikeData = req.body;
						if (isEmpty(bikeData.hour)) bikeData.hour = 0;
						if (isEmpty(bikeData.minute)) bikeData.minute = 0;
						if (isEmpty(bikeData.day)) bikeData.day = 0;
						var bikeObject = {
							override_uid_check: bikeData.override_uid_check,
							_id: bikeData._id,
							bike_name: bikeData.bike_name,
							release_date: new Date(bikeData.year, bikeData.month - 1, bikeData.day, bikeData.hour, bikeData.minute).toLocaleString("en-US", {
								timeZone: "Asia/Calcutta"
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
							images: bikeData.images,
							videos: bikeData.videos,
							texts: bikeData.texts,
							partners: bikeData.partners,
							related_bikes: bikeData.related_bikes,
							key_features: bikeData.key_features,
							is_sponsored: bikeData.is_sponsored,
							is_released: false,
							is_live: bikeData.is_live,
							click_counter: bikeData.click_counter,
							external_ratings: bikeData.external_ratings,
							predicted_ratings: bikeData.predicted_ratings,
							favorited_by: bikeData.favorited_by,
							user_visit_info: bikeData.user_visit_info
						};
						logger.debug(bikeObject.release_date.toLocaleString());
						var uniqueId = bikeObject.bike_name + bikeObject.release_date.toString() + bikeData.brand_name;
						bikeObject.uid = md5(uniqueId.replace(/\s/g, ""));
						bikeObject.is_released = helpers.checkDate(bikeObject.release_date);
						bikeDAO.modifyBike(bikeObject, function (status, message, data) {
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

module.exports = modifyBikeRouter;
