var mongoose = require('mongoose');
var productSchema = mongoose.Schema({
  imgPath: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product',productSchema);
