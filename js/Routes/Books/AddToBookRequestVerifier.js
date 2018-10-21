const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);
const isEmpty = require('./../../Utils/HelperFunctions').isEmpty;

module.exports = (req, res, next) => {
    try {
        if (isEmpty(req.body.book_name) || isEmpty(req.body.day) || isEmpty(req.body.month) ||
            isEmpty(req.body.year) || isEmpty(req.body.author) || isEmpty(req.body.language) ||
            isEmpty(req.body.genres) || isEmpty(req.body.description) || isEmpty(req.body.referrer_name) ||
            isEmpty(req.body.redirect_url)) {
            return res.status(400).json({
                "status": {
                    "code": 400,
                    "message": "Mandatory fields cannot be left blank"
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