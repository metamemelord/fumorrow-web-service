const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const logger = require('./js/Loggers/index').LoggerFactory.getLogger('Web-Service');
const packageJson = require('./package.json');

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
                "message": "Malformed JSON"
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
fumorrow.use(require('./js/Routes/Cars/index'));
fumorrow.use(require('./js/Routes/VideoGames/index'));
fumorrow.use(require('./js/Routes/Bikes/index'));
fumorrow.use(require('./js/Routes/404'));

// Routes

// Redirecting all the GET requests homepage

fumorrow.get('*', function (req, res) {
    try {
        res.writeHead(302, {
            Location: 'http://www.fumorrow.com'
        });
        res.redirect('http://www.fumorrow.com');
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
        logger.info("Fumorrow webservice v" + packageJson.version);
        logger.info("Server started");
    }
});

module.exports = fumorrow;