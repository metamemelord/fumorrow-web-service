const express = require('express');
const DAL = require('./../../../DAL/index');
const celebritiesDAO = DAL.CelebritiesDAO;
const filename = require('path').basename(__filename);
const logger = require('../../../Loggers/index').LoggerFactory.getLogger(filename);
const isEmpty = require('../../../Utils/HelperFunctions').isEmpty;

var returnAllCelebritiesRoute = express.Router();

returnAllCelebritiesRoute.post('/api/admin/celebrities/search', function (req, res) {
    try {
        var name = req.body.name;
        if (isEmpty(name)) {
            return res.status(400).json({
                "status": {
                    "code": 400,
                    "message": "Enter a valid name"
                },
                "data": null
            });
        }
        var nameTokens = name.toLowerCase().split(" ");
        celebritiesDAO.searchCelebrityByNameTokens(nameTokens, function (status, message, data) {
            return res.status(status).json({
                "status": {
                    "code": status,
                    "message": message
                },
                "data": data
            })
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

module.exports = returnAllCelebritiesRoute;