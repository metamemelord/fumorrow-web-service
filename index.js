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
fumorrow.set('env', 'development');
fumorrow.set('views', path.join(__dirname, 'views'));
fumorrow.set('view engine', 'ejs');

//

// fumorrow.get('*', function(req, res) {  
//     console.log("aaya!")
//     res.redirect('https://' + req.headers.host + req.url);
//     // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
//     // res.redirect('https://example.com' + req.url);
// })

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
            console.log("Error occurred while starting the server: "+err);
        }
        else{
            console.log("Server started on port number 3000");
        }
    }
);