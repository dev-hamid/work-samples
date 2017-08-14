var mongoose = require('mongoose');
var config = require('../config/database');
var cheerio = require('cheerio');
cheerioTableparser = require('cheerio-tableparser');
var afterLoad = require('after-load');
var Schema = mongoose.Schema;
var resultsSchema = module.exports = mongoose.Schema({
  url: {
      type: String,
      required: true
  },
  competiton: {
      type: Schema.Types.ObjectId,
      ref: 'Competition',
  },
  results: {
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

var Results = module.exports = mongoose.model('Results', resultsSchema);


module.exports.addRes = function(newRes, callback) {
    newRes.save(callback);
};
