//not complete yet

var mongoose = require('mongoose');
var config = require('../config/database');
var cheerio = require('cheerio');
cheerioTableparser = require('cheerio-tableparser');
var afterLoad = require('after-load');
var Schema = mongoose.Schema;
var standingsSchema = module.exports = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    competiton: {
        type: Schema.Types.ObjectId,
        ref: 'Competition',
    },
    stand: {
        type: [{}],
        default: []
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

var Standings = module.exports = mongoose.model('Standings', standingsSchema);


module.exports.addStand = function(newStand, callback) {
    newStand.save(callback);
};
