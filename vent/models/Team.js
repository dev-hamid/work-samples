var mongoose = require('mongoose');
var express = require('express');
var cheerio = require('cheerio'),
    cheerioTableparser = require('cheerio-tableparser');
var afterLoad = require('after-load');
var router = express.Router();
var Schema = mongoose.Schema,
 teamSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    squad: {
        type: [{}],
        required:true
    },
    url : {
      type : String,
      required: true
    },
    creationDate: {
      type: Date,
         default: Date.now,
         required: true
    },
    lastupdate: {
      type: Date
    }
});

var Team = module.exports = mongoose.model('Team', teamSchema);

module.exports.addTeam = function(newTeam, callback) {
    newTeam.save(callback);
};
