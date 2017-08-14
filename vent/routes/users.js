// express and middleware
var express = require('express'),
 router = express.Router();

// user model
var User = require('../models/User');

// database config
var config = require('../config/database');

// passport and jwt strategy middleware
var passport = require('passport'),
 jwt = require('jsonwebtoken');

// send-grid and node-mailer config
var nodemailer = require('nodemailer'),
 sgTransport = require ('nodemailer-sendgrid-transport'),
 options = {
   auth: {
       api_user: 'hamid0',
        api_key: 'aptgetdark0'
   }
};
var client = nodemailer.createTransport(sgTransport(options));

//-----------User Functions---------//

// retrive all users from db
router.get('/', function(req, res) {
    User.find(function(err, e) {
        if (err) throw err;
        else {
            return res.send(e);
        }
    });
});

// Register
router.post('/register', function(req, res, next) {
    var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(newUser, function(err, user) {
        if (err) {
            res.json({
                success: false,
                msg: 'failed'
            });
        } else {
            res.json({
                success: true,
                msg: 'Registered'
            });
        }
    });
});

// Authentication
router.post('/authenticate', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.getUserByUsername(username, function(err, user) {
        if (err) throw err;
        if (!user) {
            return res.json({
                success: false,
                msg: 'User not found'
            });
        }
        User.comparePassword(password, user.password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 86400 //24hour
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        name: user.name,
                        username: user.username,
                        password: user.password
                    }
                });
            } else {
                return res.json({
                    success: false,
                    msg: 'Wrong password'
                });
            }
        });
    });
  });

// Profile
router.get('/profile', passport.authenticate('jwt', {
    session: false}), function(req, res, next) {
    res.json({
        user: req.user
    });
});

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/profile',
                                      failureRedirect: '/register' }));

// subscribe Competition
router.post('/competSubscribe/', function(req, res, next) {
  var query = {
    _id: req.body.userid
  };
  var subscribe= {$push: {"Competition": { _id: req.body.competid }}};
  User.findByIdAndUpdate(query,subscribe ,{safe: true, upsert: true , new : true},function(err, compet) {
      if (err) return err;
      else if (!compet) {
          return res.send('err');
      } else {
          return res.send(compet);
        }
    });
});

// unsubscribe Competition
router.post('/competUnsubscribe/', function(req, res, next) {
  var query = {
    _id: req.body.userid
  };
  var unsubscribe= {$pull: {"Competition": { _id: req.body.eventid }}};
  User.findByIdAndUpdate(query,unsubscribe ,{safe: true, upsert: true },function(err, compet) {
      if (err) return err;
      else if (!compet) {
          return res.send('err');
      } else {
          return res.send(compet);
        }
    });
});

// subscribe Team
router.post('/teamSubscribe/', function(req, res, next) {
  var query = {
    _id: req.body.userid
  };
  var subscribe= {$push: {"Teams": {_id: req.body.teamid }}};
  User.findByIdAndUpdate(query,subscribe ,{safe: true, upsert: true , new : true},function(err,team) {
      if (err) return err;
      else if (!team) {
          return res.send('err');
      } else {
          return res.send(team);
        }
    });
});

// unsubscribe Team
router.post('/teamUnsubscribe/', function(req, res, next) {
  var query = {
    _id: req.body.userid
  };
  var unsubscribe= {$pull: {"Teams": {_id: req.body.teamid }}};
  User.findByIdAndUpdate(query,unsubscribe ,{safe: true, upsert: true },function(err,team) {
      if (err) return err;
      else if (!team) {
          return res.send('err');
      } else {
          return res.send(team);
        }
    });
});

// reset password request
router.post('/resetpw' , function(req ,res){
 var query = {
    username: req.body.username
 };
  User.findOne(query).select('username email resettoken name').exec(function (err , user){
    if (err) throw err;
    if (!user){
      res.json({
        success: false,
        msg: 'User Not Found'
      });
    }else{
      user.resettoken =jwt.sign({username: user.username , email: user.email}, secret , {expiresIn: '24h'});
      user.save(function(err) {
        if (err) {
          res.json({success: false, msg: err});
        }else{
           var email = {
             from: 'Vent Staff, Vent@localhost.com',
             to: user.email,
             subject: 'Vent Reset Password Request',
             text: 'Hello '+ user.name +'You recently requested a password reset link. Please click on the link below to rest your password' ,
             html: 'Hello<strong> '+user.name+ '</strong>,<br><br>You recently requested a password reset link. Please click on the link below to rest your password:<br><br><a href="http://localhost:8080/reset/'+ user.resettoken+'">http://localhost:8080/reset/</a>'
           };
           client.sendMail(email, function(err, info){
             if(err){
               console.log(err);
             }else{
               console.log('message sent :'+ info.response);
             }
           });

        res.json({success: true, msg: 'please check your email for password reset link'}) ;
        }
      });
    }
  });
});

// reset pw by setting new password
router.post('/reset/:token' , function(req ,res){
 var query = { token: req.params.token};
 var pw = {$set: {"password": req.body.password}};
  User.findOne(query).select('username email resettoken name').exec(function (err , user){
    if (err) throw err;
    if (!user){
      res.json({
        success: false,
        msg: 'User Not Found'
      });
    }else{
      User.findOneAndUpdate(query ,pw ,{safe: true, upsert: true ,new : true},function(err, users) {
          if (err) throw err;
          if (!users) {
              return res.send('err');
          } else {
              return res.send(users);
          }
      });
    }
  });
 });

// ---------------------------------------//


module.exports = router;
