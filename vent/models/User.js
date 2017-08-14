var mongoose = require('mongoose');
var config = require('../config/database');
var bcrypt = require('bcryptjs');

// For all models   screated date ..updated date
var userSchema = mongoose.Schema({
    local: {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        }
    },
    facebook: {
        id: String,
        token: String,
        name: String,
    },
    Competition: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Competition',
    },
    Teams:{
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Team',
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    lastupdate: {
        type: Date,
    },
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
};

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(9, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) {
                throw err;
            }
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
