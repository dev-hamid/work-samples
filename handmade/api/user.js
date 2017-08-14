var express = require('express'),
 router = express.Router();

 // user model
var User = require('../models/User');

// database config
var config = require('../config/database');

// passport and jwt strategy middleware
var passport = require('passport'),
 jwt = require('jsonwebtoken');

 var multer = require('multer');
 var storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'img/');
   },
   filename: function (req, file, cb) {
     cb(null, file.fieldname + '-' + Date.now()+'.jpg');
   }
 });
 var upload = multer({ storage: storage }).single('avatar');
 router.post('/:id/uploadImg',(req, res)=> {
   upload(req, res,(err)=> {
     if (err) {
       // An error occurred when uploading
       res.json({msg:'something went wrong..'});
     }
     // Everything went fine
     res.json({success:true, msg:'uploded successfully'});
   });
 });

 // retrive all users from db
router.get('/', function(req, res) {
  try{
      User.find(function(err, e) {
        if (err) throw err;
        if(!e){
          res.json({msg:'there is no users'});
        }else {
            return res.send(e);
        }
      })
      .sort({name:1})
      .skip(parseInt(req.query.Offset))
      .limit(parseInt(req.query.Limit));
  }catch(err){
    res.json({msg:'something went wrong...'});
  }
});

router.get('/:id/search',(req,res)=>{
  try{
    User.find({$or:[{ "name": new RegExp(req.query.Query, 'i')},
                    {"username": new RegExp(req.query.Query, 'i')}]
                    },(err,video)=>{
      if(err) throw err;
      if(!video){
        res.json({msg:'no such video'});
      }else{
        res.send(video);
      }
    })
    .sort({name:1})
    .skip(parseInt(req.query.Offset))
    .limit(parseInt(req.query.Limit));
  }catch(err){
    console.log(err);
    res.json({msg:'something went wrong..'});
  }
});

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

module.exports = router;
