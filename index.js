const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const logger = require('./js/Loggers/index').LoggerFactory.getLogger('Web-Service');
const filename = require('path').basename(__filename);

var fumorrow = express();

fumorrow.use(bodyParser.json());
fumorrow.set('env', process.env.ENVIRONMENT);

/**
 * Initial filter to check issues in the request
 */
fumorrow.use((error, req, res, next) => {
    if (error) {
        logger.warn("Malformed JSON");
        return res.status(error.status).json({
            "status": {
                "code": error.status,
                "message": "Bad request"
            },
            "data": null
        });
    }
    return next();
});

/**
 *  API Routes
 */
fumorrow.use(require('./js/Routes/Commons/index'));
fumorrow.use(require('./js/Routes/Movies/index'));
fumorrow.use(require('./js/Routes/Books/index'));
fumorrow.use(require('./js/Routes/Bikes/index'));
fumorrow.use(require('./js/Routes/404'));

// Routes

//Redirecting all  the GET requests to the main website.

fumorrow.get('*', function (req, res) {
    try {
        res.writeHead(301, {
            Location: 'http://www.fumorrow.com'
        });
    } catch (error) {
        logger.error(error);
    } finally {
        res.end();
    }
});

// Server

fumorrow.listen(3000, (error) => {
    if (error) {
        logger.fatal(error);
    } else {
        logger.info("Server started");
    }
});