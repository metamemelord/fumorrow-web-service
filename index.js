const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const environment = require('dotenv/config');
const logger = require('./Loggers/index').Logger;
const filename = require('path').basename(__filename);

var fumorrow = express();

fumorrow.use( bodyParser.json() ); 
fumorrow.set('env', process.env.ENVIRONMENT);
fumorrow.use((error, req, res, next) => {
    if(error){
        logger.warn("Malformed JSON");
        return res.status(error.status).json({
            "status":{
                "code":error.status,
                "message":"Bad request"
            },
            "data":null
        });
    }
    return next();
});

// API Routes

fumorrow.use(require('./Routes/Commons/index'));
fumorrow.use(require('./Routes/Movies/index'));

// Routes

//Redirecting all  the GET requests to the main website.

fumorrow.get('*', function(req,res){
    try{
        res.writeHead(301,
            {Location: 'http://www.fumorrow.com'}
        );
    }
    catch(error){
        logger.error(filename + ": " + error);
    } finally{
    res.end();
    }
});

// Server

fumorrow.listen(3000, function(error){
        if(error){
            logger.fatal(filename + ": " + error);
        }
        else{
            logger.info("Server started");
        }
    }
);