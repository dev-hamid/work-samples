var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var Hbs = require('express-handlebars');
var users = require('./routes/users');

var app = express();

mongoose.connect('localhost:27017/Fiverr1');
require('./config/passport');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'secsecsecret', resave: false, saveUninitialized: false})); // session secret
// app.engine('.hbs',Hbs({defaultLayout: 'layout',extname: '.hbs'}));
// app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', users);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


app.get('/auth/facebook', passport.authenticate('facebook',{scope: ['email']}));

// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
	passport.authenticate('facebook'),(err, res)=>{
    res.send({done: true});
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
