var mongoose = require('mongoose');
var config = require('../config/database');
var Admin = require('./Admin');
var User = require('./User');
var eventSchema = mongoose.Schema({
     title: {
       type: String,
       required: true
     },
     author: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Admin',
     },
     category: {
       type: String,
       required: true
     },
    location: {
         long: {
            type: Number,
            required: true
               },
         lat: {
            type: Number,
            required: true
              },
         address:{
           type: String,
           required: true
             }
        },
     date: {
       type: Date,
       required: true
     },
     start: {
       type: String,
       required: true
          },
     end: {
       type: String,
       required: true
     },
     description: {
       type: String,
       required: true
     },
     comments: {
       type:[{
       owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref : 'User',
        required: true
             },
      rate: {
        type: Number,
        required: true,
        default: 0
             },
       content: {
         type: String,
         required: true
             }
     }],
     default: []
   },
   OverAllRate: {
      type: Number,
      default: 0
   },
   createdDate: {
     type : Date,
     default: Date.now,
     required: true

   },
   updatedAt:{
     type: Date,
     default: Date.now,
     required: true

   }

});
var Event = module.exports = mongoose.model('Event', eventSchema);

module.exports.createEvent = function(newEvent , callback) {
          newEvent.save(callback);
};
