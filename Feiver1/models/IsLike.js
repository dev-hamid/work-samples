var mongoose = require('mongoose');

var isLike = mongoose.Schema({
  post:{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Post',
    required: true
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required: true
  }
});

module.exports = mongoose.model('IsLike',isLike);
