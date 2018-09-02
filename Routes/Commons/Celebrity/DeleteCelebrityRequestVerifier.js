const logger = require('../../../Loggers/index').Logger;
const filename = require('path').basename(__filename);
const isEmpty = require('./../../../Misc/HelperFunctions').isEmpty;

module.exports = (req,res,next) => {
        try{
            if(isEmpty(req.body.pid)){
                return res.status(400).json({
                    "status":{
                        "code":400,
                        "message":"Bad request"
                    },
                    "data":null
                });
            }
            else{
                next();
            }
        }
        catch(error){
            logger.error(filename + ": " + error);
            return res.status(500).json({
                "status":{
                    "code":500,
                    "message":"Internal server error"
                },
                "data":null
            });
        }
    }