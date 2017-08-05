var mongoose = require('mongoose');

var Task = mongoose.model('Task', {
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 40
  }, time: {
    type: Number,
    default: 0,
    required: true
  }, goalTime: {
    type: Number,
    required: true,
    default: 36000000000
  }, startTime: {
    type: Number,
    default: 0,
    required: true
  }, stopTime: {
    type: Number,
    default: 0,
    required: true
  }
});

module.exports = {Task};
