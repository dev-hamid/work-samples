
// express and it's middleware
var express = require('express'),
 app = express();
 var port =5000;

// packages
var bodyParser = require('body-parser');
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

// Db and passport config
var config = require('./config/database');

// models and routes
var users = require('./routes/users');
var api = require('./routes/api');
var User =require('./models/User');

//bodyparser middlewear
app.use(bodyParser.json());
//pasport middlewear
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

mongoose.connect(config.database);
var db =mongoose.connection;

//on con
mongoose.connection.on('connected', function() {
    console.log('Connected to database => ' + config.database);
});

//on err
mongoose.connection.on('error', function(err) {
    console.log('database error :' + err);
});

//setting Routes
app.use('/users', users);
app.use('/api', api);

//handeling static pages
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port,function(err, callback){
  if (err) throw err;
  else{
  console.log('Vent Back-End is running on port: '+ port);
}
});

exports = module.exports = app;
