const express = require("express");
const DAL = require("../../DAL/index");
const frontendIdVerifier = require("../RouteUtils").requestIdVerifier;
const frontendDAO = DAL.FrontendDAO;
const jwt = require("jsonwebtoken");
const helpers = require("../../lib/HelperFunctions");
const tokenVerifier = require("./../../Utils/Token/TokenVerifier");
const tokenAuthCheck = require("./../../Utils/Token/TokenAuthCheck");
const md5 = require("md5");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);
const isEmpty = require("./../../lib/HelperFunctions").isEmpty;

const modifyFrontendRouter = express.Router();

modifyFrontendRouter.post(
    "api/frontend/modify",
    tokenVerifier,
    tokenAuthCheck,
    frontendIdVerifier,
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
                    if (!authData["privilages"].includes("frontend")) {
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
                        var frontendData = req.body;
                        var frontendObject = {
                            override_uid_check: frontendData.override_uid_check,
                            _id: frontendData._id,
                            name: frontendData.name,
                            uid: "",
                            links: frontendData.links,
                            color: frontendData.color,
                            labels: frontendData.labels,
                            extras: frontendData.extras
                        };
                        var uniqueId = frontendObject.name;
                        frontendObject.uid = md5(uniqueId.replace(/\s/g, ""));
                        frontendDAO.modifyFrontend(frontendObject, function (status, message, data) {
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

module.exports = modifyFrontendRouter;
