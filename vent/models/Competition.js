//completed
var mongoose = require('mongoose');
var config = require('../config/database');
var Standings = require('./Standings');
var Fixtures = require('./Fixtures');
var Results = require('./Results');
var Archive = require('./Archive');

var Schema = mongoose.Schema,
    competitonSchema = mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        standings: {
            type: Schema.Types.ObjectId,
            ref: 'Standings',
            required: true
        },
        fixtures: {
            type: Schema.Types.ObjectId,
            ref: 'Fixtures',
            required: true
        },
        archive: {
            type: Schema.Types.ObjectId,
            ref: 'Archive',
            required: true
        },
        results: {
            type: Schema.Types.ObjectId,
            ref: 'Results',
            required: true
        },
        logo: {
            type: String
        },
        creationDate: {
            type: Date,
            default: Date.now,
            required: true
        },
        lastupdate: {
            type: Date,
        }
    });

var Competition = module.exports = mongoose.model('Competition', competitonSchema);

module.exports.addCompetition = function(newCompet, callback) {
    newCompet.save(callback);
};

module.exports.getCompetByTitle = function(title, callback) {
    var query = {
        title: title
    };
    Competition.findOne(query, callback);
};



module.exports.retriveCompetition = function() {

};

module.exports.display = function(req, res) {
    var list = [];
    Competition.find(function(err, e) {
        if (err) throw err;
        else {
            return res.send(e);

        }
    });
};
