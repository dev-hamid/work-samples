var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var cors = require('cors');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

var config = require('./config/database');
var users = require('./routes/users');
var events = require('./routes/events');
var admins = require('./routes/admins');
var videos = require('./routes/videos');

// express middleware
var app = express();
var port = 3001;
//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//cors middlewear
app.use(cors());
//pasport middlewear
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
mongoose.Promise = global.Promise;
mongoose.connect(config.database);
var db =mongoose.connection;
//on conn
mongoose.connection.on('connected', function() {
    console.log('Connected to database =>' + config.database);
});
//on err
mongoose.connection.on('error', function(err) {
    console.log('database error :' + err);
});
//setting Routes
app.use('/users', users);
app.use('/videos', videos);
app.use('/events', events);
app.use('/panel', admins );

// these lines of code must be uncommented in production environment
// app.get('*', function(req , res){
//   res.sendFile(path.join(__dirname, 'public/index.html'));
//  });

// handeling static pages
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port ,function(err, callback){
  if (err) throw err;
  else{
  console.log('F3aliati reuns on '+ port);
}
});

exports = module.exports = app;
