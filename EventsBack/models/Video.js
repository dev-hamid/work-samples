var mongoose = require('mongoose');
var config = require('../config/database');
var User = require('./User');


var videoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
      type: String,
      required: true
    },
    comments: {
      type: [{
          owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required: true
          },
          content: {
            type: String,
            required: true
          }
       }]
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

var Video = module.exports = mongoose.model('Video', videoSchema);
module.exports.addVideo = function(newVideo , callback) {
          newVideo.save(callback);
};
