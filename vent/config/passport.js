var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/User');
var config = require('../config/database');
var auth = require('./auth');
var FacebookStrategy = require('passport-facebook').Strategy;


module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload);
        User.getUserById(jwt_payload._id, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
    passport.use(new FacebookStrategy({
        clientID: auth.facebookAuth.clientID,
        clientSecret: auth.facebookAuth.clientSecret,
        callbackURL: auth.facebookAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
         process.nextTick(function(){
           User.findOne({'facebook.id': profile.id}, function(err, user){
             if (err) return done(err);
             if(user) return done (null , user);
             else{
               var newUser = new User();
               newUser.facebook.id = profile.id;
               newUser.facebook.token = accessToken;
               newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
               newUser.save(function(err){
                 if (err) throw err;
                 return done(null , newUser);
               });
             }
           });
         });
      }
    ));

};
