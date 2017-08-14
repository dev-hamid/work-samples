var express = require('express');
var router = express.Router();
var Event = require('../models/Event');
var config = require('../config/database');
var Attendees = require('../models/event_attendees');
var ObjectId = require('mongodb').ObjectId;
var cors = require('cors');
var multer = require('multer');
var upload = multer({dist : 'public/uploads'});
var passport = require('passport');
// retrive all events
router.get('/', function(req, res) {
    Event.find(function(err, events) {
        if (err) {
            throw err;
        } else {
            return res.send(events);
        }
    }).limit(10);
});

// retrive all events in particular category
router.post('/category/', function(req, res, next) {
var cat =req.body.category;
    var query = {
         'category': new RegExp(cat, 'i')
    };
    Event.find(query, function(err, events) {
        if (err) throw err;
        if (!events) {
            return res.send('err');
        } else {
            return res.send(events);
        }
    });
});
router.post('/imgup',upload.any(), function(req, res) {
     res.send(req.body);
});

// retrive all events attendece tables
router.get('/tables', function(req, res) {
  Attendees.find( function(err, attendees) {
      if (err) {
          throw err;
      } else {
           res.send(attendees);
        }
    });
   });

// retrive users attending particular event
router.get('/users/', function(req, res) {
    var query = {
      Event :req.body.id
    };
    Attendees.find(query , function(err, users) {
        if (err) throw err;
        if (!users) {
            return res.send('err');
        } else {
            return res.send(users);
        }
    });
});

// delete event by id
router.post('/delete',cors(), function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    var dEvent = {
        _id: req.body._id
    };
    var dAttendees ={
      Event: req.body._id
    };
    Event.findById(dEvent, function(err, events) {
        if (err) console.log(err);
        if (!events) {
            return res.send('err');
        } else {
            return res.send(events);
        }
    }).remove().exec();
		Attendees.findById(dAttendees, function(err, attendees) {
        if (err) console.log(err);
    }).remove().exec();
});

// create new event
router.post('/create', function(req, res, next) {
    var id = ObjectId();
    var newEvent = new Event({
        _id: id,
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        location: {
          long: req.body.long,
          lat: req.body.lat,
          address: req.body.address
            },
        date: req.body.date,
        start: req.body.start,
        end: req.body.end,
        description: req.body.description
    });
    Event.createEvent(newEvent, function(err, events) {
        if (err) {
          return  res.json({
                success: false,
                msg: 'failed' + err + ' '
            });
        } else {
          return  res.json({
                success: true,
                msg: 'new Event was added successfuly'
            });
        }
    });
});

// edit event by id
router.post('/edit/', function(req, res, next) {
    var query = {
        _id: req.body.id
    };
    var update = {
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        location: {
          long: req.body.long,
          lat: req.body.lat,
          address: req.body.address
            },
        date: req.body.date,
        start: req.body.start,
        end: req.body.end,
        rate: req.body.rate,
        description: req.body.description,
        comments: req.body.comments,
        OverAllRate:req.body.overallrate
    };
    Event.update(query, update, function(err, numAffected) {
        if (err) throw err;
        return res.send(numAffected);
    });
});

module.exports = router;
