const express = require('express');
const DAL = require('./../../../DAL/index');
const celebritiesDAO = DAL.CelebritiesDAO;
const tokenVerifier = require('./../../../Misc/TokenVerifier');
const logger = require('../../../Loggers/index').Logger;
const filename = require('path').basename(__filename);

var returnAllCelebritiesRoute = express.Router();

returnAllCelebritiesRoute.post('/api/admin/celebrities', function (req, res) {
    try{
        celebritiesDAO.getAllCelebrities(function(status, message, data) {
            res.status(status).json({
                "status":{
                    "code":status,
                    "message":message
                },
                "data":data
            })
        });
    } catch(error){
        logger.error(filename + ": " + error);
        return res.status(500).json({
            "status":{
                "code":500,
                "message":"Internal server error"
            },
            "data":null
        });
    }
});

module.exports = returnAllCelebritiesRoute;