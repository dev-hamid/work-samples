var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required: true
  },
  post:{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Post',
    required: true
  },
  date:{
    type: Date,
    required: true,
    default: Date.now
  },
  content:{
    type: String,
    require: true
  }
});

module.exports = mongoose.model('Comment',commentSchema);
