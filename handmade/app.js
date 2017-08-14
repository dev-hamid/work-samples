var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
var connect = require('connect');
var bodyParser = require('body-parser');
var db = require('./config/database');
var users = require('./api/user');
var videos = require('./api/video');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;
// all environments
app.set('port', process.env.PORT || 3000);
//Add headers
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use('/users',users);
app.use('/videos',videos);

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(db.database)
       .then(() => console.log('connection succesful'))
       .catch((err) => console.error(err));

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

exports = module.exports = app;
