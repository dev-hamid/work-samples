//completed
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Video = require('../models/Video');
var Event = require('../models/Event');
var Attendees = require('../models/event_attendees');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var nodemailer = require('nodemailer');
var sgTransport = require ('nodemailer-sendgrid-transport');
var options = {
   auth: {
       api_user: 'hamid0',
        api_key: 'aptgetdark0'
   }
};
var client = nodemailer.createTransport(sgTransport(options));

//Register
router.post('/register',function(req , res){
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

//Authentication
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
                    token: 'JWT '+ token,
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

//Profile
router.get('/profile', passport.authenticate('jwt', {
                session: false    }), function(req, res, next) {
    res.json({
        user: req.user
    });
});

// delete User
router.post('/delete', function(req, res, next) {
    var dUser = {
        id: req.body.id
    };
    User.find(dUser, function(err, users) {
        if (err) throw err;
        if (!users) {
            return res.send('err');
        } else {
            return res.send(users);
        }
    }).remove().exec();
});

// edit User info
router.post('/edit/', function(req, res, next) {
    var query = {
        _id: req.body.id
    };
    var update = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    };
    User.update(query, update, function(err, numAffected) {
        if (err) throw err;
        return res.send(numAffected);
    });
});

// post a comment on video
router.post('/commentV/', function(req, res, next) {
  var query = {
    _id: req.body.videoid
  };
  var comment= {$push: {"comments": { owner: req.body.owner, content:req.body.content }}};
  Video.findByIdAndUpdate(query,comment ,{safe: true, upsert: true ,new : true},function(err, videos) {
      if (err) throw err;
      if (!videos) {
          return res.send('err');
      } else {
          return res.send(videos);
      }
  });
});

// post comment on event & rate
router.post('/commentE/', function(req, res, next) {
  var query = {
    _id: req.body.id
  };
  var comment= {$push: {"comments": { owner: req.body.id, rate: req.body.rate ,content:req.body.content }}};
  Event.findByIdAndUpdate(query,comment ,{safe: true, upsert: true , new : true},function(err, events) {
      if (err) return err;
      else if (!events) {
          return res.send('err');
      } else {
          return res.send(events);
        }
    });
  var rate =  Event.aggregate([ {$project: {OverAllRate : {$avg: '$rate'}}}]);
     console.log(rate);
   Event.findByIdAndUpdate(query,rate ,{safe: true, upsert: true , new : true},function(err, events) {

   });
});

// retrive events for particular user
router.get('/attendece/', function(req, res) {
    var query = {
      User :req.body.User
    };
    Attendees.find(query , function(err, events) {
        if (err) throw err;
        if (!events) {
            return res.send('err');
        } else {
            return res.send(events);
        }
    });
});

// uncomment event
router.post('/uncommentE/', function(req, res, next) {
  var query = {
    Event: req.body.Event
  };
  var comment= {$pull: {"comments": { owner: req.body.owner, rate: req.body.rate ,content:req.body.content }}};
  Event.findByIdAndUpdate(query,comment ,{safe: true, upsert: true , new : true},function(err, events) {
      if (err) return err;
      else if (!events) {
          return res.send('err');
      } else {
          return res.send(events);
        }
    });
  var rate =  Event.aggregate([ {$project: {OverAllRate : {$avg: '$rate'}}}]);
     console.log(rate);
   Event.findByIdAndUpdate(query,rate ,{safe: true, upsert: true , new : true},function(err, events) {

   });
});

// attend an event
router.post('/attend/', function(req, res, next) {
  var newAttendees = new Attendees({
    User: req.body.User,
    Event : req.body.Event
  });
  Attendees.create(newAttendees ,function(err, attendees) {
      if (err) throw err;
      if (!attendees) {
          return res.json(false);
      } else {
          return res.json(true);
      }
  });
});

// un attend an event
router.post('/unattend/', function(req, res, next) {
      var attend = {
          User:req.body.User,
          Event: req.body.Event
      };
      Attendees.find(attend, function(err, users) {
          if (err) throw err;
          if (!users) {
              return res.send('err');
          } else {
              return res.send('true');
          }
      }).remove().exec();
  });

// retrive all users
  router.get('/', function(req, res) {
      User.find(function(err, users) {
          if (err) {
              throw err;
          } else {
              return res.send(users);
          }
      });
  });

//list of attending events
router.get('/attended/', function(req, res, next) {
 var query = {
   _id: req.body.id
 };
 Attendees.find(query ,function(err, attendees) {
    if (err) throw err;
    if (!attendees) {
        return res.send('err');
    } else {
        return res.send(attendees);
    }
 });
});

// reset password  user check of existance and sending restpw mail
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
             from: 'Events Staff, events@localhost.com',
             to: user.email,
             subject: 'Events Reset Password Request',
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

module.exports = router;
