var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    send:{
      type: mongoose.Schema.Types.ObjectId,
      ref : 'User',
      required: true
    },
    recive:{
      type: mongoose.Schema.Types.ObjectId,
      ref : 'User',
      required: true
    },
    date:{
      type : Date,
      required: true,
      default: Date.now
    },
    content:{
      type: String,
      required: true
    }
});

module.exports = mongoose.model('Message',messageSchema);
