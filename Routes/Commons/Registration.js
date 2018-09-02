const express = require('express');
const DAL = require('./../../DAL/index');
const registrationDAO = DAL.RegistrationDAO;
const logger = require('../../Loggers/index').Logger;
const filename = require('path').basename(__filename);
const isEmpty = require('./../../Misc/HelperFunctions').isEmpty;
const registrationRouter = express.Router();

registrationRouter.post('/api/admin/registration', function (req, res) {
    try {
        if(!(parseInt(process.env.REGISTRATION_SERVICE_ACTIVE))){
            return res.status(503).json({
                "status":{
                    "code":503,
                    "message":"Registration service has been disabled. Please contact the admin."
                },
                "data":null
            });
        }
        if(isEmpty(req.body.name) || isEmpty(req.body.username) || isEmpty(req.body.email) || isEmpty(req.body.password)){
            return res.status(400).json({
                "status":{
                    "code":400,
                    "message":"Please check the details"
                },
                "data":null
            });
        } else if (req.body.username.split(" ").length > 1)
            return res.status(400).json({
                "status":{
                    "code":400,
                    "message":"Username cannot contain spaces"
                },
                "data":null
            });
        else{
            var userDetails = req.body;
            userDetails.name = userDetails.name.toLowerCase();
            userDetails.username = userDetails.username.toLowerCase();
            registrationDAO.performRegistration(userDetails, (status, message, data) => {
                return res.status(status).json({
                    "status":{
                        "code":status,
                        "message":message
                    },
                    "data":data
                });
            });
        }
    }
    catch (error) {
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
module.exports = registrationRouter;