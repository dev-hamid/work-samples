var express = require('express');
var router = express.Router();
var Video = require('../models/Video');
var config = require('../config/database');
var cors = require('cors');


// retrive all videos
router.get('/', function(req, res) {
    Video.find(function(err, videos) {
        if (err) {
            throw err;
        } else {
            return res.send(videos);
        }
    });
});

// add a new video
router.post('/add', function(req, res, next) {
    var newVideo = new Video({
        title: req.body.title,
        url: req.body.url,
        description: req.body.description
    });
    Video.addVideo(newVideo, function(err, videos) {
        if (err) {
            res.json({
                success: false,
                msg: 'failed' + err + ' '
            });
        } else {
            res.json({
                success: true,
                msg: 'new video was added successfuly'
            });
        }
    });
});

//  delete a video
router.post('/delete', cors(),function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
    var dVideo = {
        _id: req.body._id
    };
    Video.findById(dVideo, function(err, videos) {
        if (err) console.error(err); 
        if (!videos) {
            return res.send('err');
        } else {
            return res.send(videos);
        }
    }).remove().exec();
});

// edit a videos
router.post('/edit/', function(req, res, next) {
    var query = {
        _id: req.body.id
    };
    var update = {
        title: req.body.title,
        url: req.body.url,
        description: req.body.description,
        comments: req.body.comments
    };
    Video.update(query, update, function(err, numAffected) {
        if (err) throw err;
        return res.send(numAffected);
    });
});

module.exports = router;
