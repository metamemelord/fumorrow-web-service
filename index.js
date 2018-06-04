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
    try{
        res.writeHead(301,
            {Location: 'http://www.fumorrow.com'}
        );
    }
    catch(error){
        console.log("ERROR: ", error);
    } finally{
    res.end();
    }
});

// Server

fumorrow.listen(3000, function(err){
        if(err){
            console.log("ERROR: "+err);
        }
        else{
            console.log(new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Calcutta'
            }));
            console.log("INFO: Server started on port number 3000");
        }
    }
);