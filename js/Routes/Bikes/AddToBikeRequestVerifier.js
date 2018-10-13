const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isEmpty = require('./../../Misc/HelperFunctions').isEmpty;

module.exports = (req, res, next) => {
    try {
        if (isEmpty(req.body.bike_name) || isEmpty(req.body.brand_name) || isEmpty(req.body.month) ||
            isEmpty(req.body.year) || isEmpty(req.body.description) || isEmpty(req.body.referrer_name)) {
            return res.status(400).json({
                "status": {
                    "code": 400,
                    "message": "Bad request"
                },
                "data": null
            });
        }
        else {
            next();
        }
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
}