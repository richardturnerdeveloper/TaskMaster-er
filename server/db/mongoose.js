var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TaskMaster-Er");

module.exports = {mongoose};
