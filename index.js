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

fumorrow.get('*', function(req,res){
    res.status(200).send("<html><head><meta name='robots' content='noindex'></head><body><div align='center'><h1>Hey! We are fumorrow!</h1></div></body></html>");
})

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