var mongoose = require('mongoose');
//var User = require('./User');
var postSchema = mongoose.Schema({
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref : 'User',
      required: true
    },
    likesCounter:{
      type: Number,
      required: true,
      default: 0
    },
    commentsCounter:{
      type: Number,
      required: true,
      default: 0
    },
    coordinates:{
      type: [Number],
      required: true,
    },
    date:{
      type: Date,
      required: true,
      default: Date.now
    },
    content:{
      type: String,
      required: true
    },
    tags:{
      type: Array,
      required: true,
      default:[]
    }
});

module.exports = mongoose.model('Post',postSchema);
