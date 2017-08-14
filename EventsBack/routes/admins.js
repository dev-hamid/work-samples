//completed
var express = require('express');
var router = express.Router();
var Admin = require('../models/Admin');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

router.get('/', function(req, res) {
  Admin.find(function(err, admins) {
        if (err) {
            throw err;
        } else {
            return res.send(admins);
        }
    });
});

// Setting new Addmin
router.post('/add', function(req, res, next) {
    var newAdmin = new Admin({
        adminname: req.body.adminname,
        password: req.body.password
    });
    Admin.addAdmin(newAdmin, function(err, user) {
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
    var adminname = req.body.adminname;
    var password = req.body.password;
    Admin.getAdminByName(adminname, function(err, admin) {
        if (err) throw err;
        if (!admin) {
            return res.json({
                success: false,
                msg: 'No such admin'
            });
        }
        Admin.comparePassword(password, admin.password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                var token = jwt.sign(admin, config.asecret, {
                    expiresIn: 1200 //1hour
                });
                res.json({
                    success: true,
                    token: 'JWT '+ token,
                    admin: {
                        adminname: admin.adminname,
                        password: admin.password
                    }
                });
            } else {
                return res.json({
                    success: false,
                    msg: 'Wrong credentals'
                });
            }
        });
    });
});

// Panel
router.get('/panel', passport.authenticate('jwt', {
                session: false    }), function(req, res, next) {
    res.json({
        admin: req.adminname
    });
});

// delete Admin
router.post('/delete', function(req, res, next) {
    var dAdmin = {
        _id: req.body._id
    };
    Admin.find(dAdmin, function(err, admins) {
        if (err) throw err;
        if (!admins) {
            return res.send('err');
        } else {
            return res.send(admins);
        }
    }).remove().exec();
});

// edit Admins info
router.post('/edit/', function(req, res, next) {
    var query = {
        _id: req.body.id
    };
    var update = {
      adminname: req.body.adminname,
      role: req.body.role
    };
    Admin.update(query, update, function(err, numAffected) {
        if (err) throw err;
        return res.send(numAffected);
    });
});


module.exports = router;
