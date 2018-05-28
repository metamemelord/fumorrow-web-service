var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var environment = require('dotenv/config');
//var secure = require('express-force-https');
var fumorrow = express();


//fumorrow.use(secure);
// fumorrow.use(express.static(path.join(__dirname,'bower_components')));
// fumorrow.use(express.static(path.join(__dirname,'res')));

fumorrow.use( bodyParser.json() ); 
fumorrow.set('env', 'production');

// API Routes

fumorrow.use(require('./Routes/Commons/index'));
fumorrow.use(require('./Routes/Movies/index'));

// Routes

// fumorrow.use(require('./controllers/HomepageController'));
// fumorrow.use(require('./controllers/AboutController'));
// fumorrow.use(require('./controllers/MoviesController'));
// fumorrow.use(require('./controllers/CarsController'));
// fumorrow.use(require('./controllers/404'));

// Server

fumorrow.listen(3000, function(err){
        if(err){
            console.log("ERROR: "+err);
        }
        else{
            console.log("INFO: Server started on port number 3000");
        }
    }
);