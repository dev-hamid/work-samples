var passport = require('passport');
var User = require('../models/user');
var localStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id,(err ,user)=>{
        done(err, user);
    });
});

passport.use('local.register',
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done)=>{
        User.findOne({'email': email}, (err, user)=>{
            if(err) return done(err);
            if(user) return done(null, false, {message: 'Email is already in use'});
            var newUser= new User();
            newUser.email= email;
            newUser.password= newUser.encrypt(password);
            newUser.save((err, result)=>{
              if(err) return done(err);
              return done(null , newUser);
            });
        });
    }));
