var mongoose = require('mongoose');
var config = require('../config/database');
var cheerio = require('cheerio');
cheerioTableparser = require('cheerio-tableparser');
var afterLoad = require('after-load');
var Schema = mongoose.Schema;
var archiveSchema = module.exports = mongoose.Schema({
  url: {
      type: String,
      required: true
  },
  competiton: {
      type: Schema.Types.ObjectId,
      ref: 'Competition',
  },
  arch: {
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

var Archive = module.exports = mongoose.model('Archive', archiveSchema);


module.exports.addArch = function(newArch, callback) {
    newArch.save(callback);
};
