//not completed yet
var mongoose = require('mongoose');
var express = require('express');
var cheerio = require('cheerio'),
    cheerioTableparser = require('cheerio-tableparser');
var afterLoad = require('after-load');
var router = express.Router();
var Schema = mongoose.Schema,
    fixturesSchema = mongoose.Schema({
        url: {
            type: String,
            required: true
        },
        competiton: {
            type: Schema.Types.ObjectId,
            ref: 'Competition',
        },
        creationDate: {
            type: Date,
            default: Date.now,
            required: true
        },
        lastupdate: {
            type: Date
        },
        fix: {
            type: [{}],
            default: []
        }
    });

var Fixtures = module.exports = mongoose.model('Fixtures', fixturesSchema);
module.exports.addFix = function(newFix, callback) {
    newFix.save(callback);
};
