const express = require('express');
const DAL = require('../../DAL/index');
const bookRequestVerifier = require('../RouteUtils').requestIdVerifier;
const bookDAO = DAL.BookDAO;
const deleteBookRouter = express.Router();
const jwt = require('jsonwebtoken');
const helpers = require("../../Utils/HelperFunctions");
const tokenVerifier = require('./../../Utils/Token/TokenVerifier');
const tokenAuthCheck = require('./../../Utils/Token/TokenAuthCheck');
const isEmpty = require('./../../Utils/HelperFunctions').isEmpty;
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);

deleteBookRouter.post('/api/book/delete', tokenVerifier, tokenAuthCheck, bookRequestVerifier, function (req, res) {
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
                if (!authData['privilages'].includes('books')) {
                    return res.status(403).json({
                        "status": {
                            "code": 403,
                            "message": "Insufficient privilages"
                        },
                        "data": null
                    });
                } else {
                    try {
                        var id = req.body._id;
                        bookDAO.removeById(id, function (status, message, data) {
                            return res.status(status).json({
                                "status": {
                                    "code": status,
                                    "message": message
                                },
                                "data": data
                            });
                        });
                    } catch (error) {
                        logger.error(error);
                        return res.sendStatus(304);
                    }
                }
            }
        })
    }
    catch (error) {
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

module.exports = deleteBookRouter;
