const mongoose = require('mongoose');

var env = process.env.NODE_ENV || "development";
var port;

mongoose.Promise = global.Promise;

// process.env.NODE_ENV ||
if (env === 'development'){
  port = 3000;
  process.env.MONGO_URL = 'mongodb://localhost:27017/taskmaster-er-production';
} else if (env === 'test'){
  port =  3000;
  process.env.MONGO_URL = 'mongodb://localhost:27017/taskmaster-er-test';
} else if (env === 'production'){
  port = process.env.PORT;
  process.env.MONGO_URL = "";
}

mongoose.connect(process.env.MONGO_URL);

module.exports = {env, port, mongoose};
