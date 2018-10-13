const express = require('express');
const DAL = require('../../DAL');
const bikeDAOForRetrieval = DAL.bikeDAOForRetrieval;
const bikeByIdRouter = express.Router();
const filename = require('path').basename(__filename);
const logger = require('../../Loggers').LoggerFactory.getLogger(filename);
const isNotEmpty = require('../../Misc/HelperFunctions').isNotEmpty;

bikeByIdRouter.post('/api/bike/:id', function (req, res) {
    try {
        if (isNotEmpty(req.body._id) || isNotEmpty(req.params.id)) {
            var id = isNotEmpty(req.params.id) ? req.params.id : req.body._id;
            bikeDAOForRetrieval.getById(id, function (status, message, data) {
                return res.status(status).json({
                    "status":{
                        "code":status,
                        "message":message
                    },
                    "data":data
                });
            });
        }
        else {
            return res.status(400).json({
                "status":{
                    "code":400,
                    "message":"Provide an ID before proceeding"
                },
                "data":null
            });
        }
    } catch (error) {
        logger.error(error);
        return res.sendStatus(304);
    }
});

module.exports = bikeByIdRouter;