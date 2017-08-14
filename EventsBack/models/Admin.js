var mongoose = require('mongoose');
var config = require('../config/database');
var bcrypt = require('bcryptjs');

var adminSchema = mongoose.Schema({
    adminname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
      type: String,
      required: true,
      default: "Admin"
    },admintoken: {
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

var Admin = module.exports = mongoose.model('Admin', adminSchema);

module.exports.getAdminByName =function(adminName, callback) {
    var query = {
        adminname: adminName
    };
    Admin.findOne(query, callback);
};

module.exports.addAdmin = function(newAdmin, callback) {
    bcrypt.genSalt(9, function(err, salt) {
        bcrypt.hash(newAdmin.password, salt, function(err, hash) {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
};

module.exports.comparePassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};
