
var mongoose = require('mongoose');
var config = require('../config/database');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    usertoken: {
      type:String,
      required: false
    },
    createdAt: {
       type : Date,
       default: Date.now
    },
    updatedAt:{
      type: Date,
      default: Date.now
    }
});
var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByUsername = function(userName, callback) {
    var query = {
        username: userName
    };
    User.findOne(query, callback);
};

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.comparePassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};

module.exports.isAttending = function(query){
 Attendees.find(query,function (err,Attend) {
  if (err) return console.log(err);
  if(!Attend){
    return res.json(false);
  }else{
    return res.json(true);
  }
});
};
