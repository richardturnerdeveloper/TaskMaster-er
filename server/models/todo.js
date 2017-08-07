var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  title: {
    type: String,
    required: true,
    unique: true,
    maxlength: 40,
    minlength: 1
  }, completed: {
    type: Boolean,
    default: false,
    required: true
  }, dateStarted: {
    type: String,
    default: new Date().toDateString(),
    required: true
  }, color: {
    type: String,
    required: true,
    default: '#333'
  }, dateCompleted: {
    type: String
  }
});

module.exports = {Todo};
