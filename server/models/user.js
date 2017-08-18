const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const _ = require('lodash');
const bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.methods.toJSON = function(){
  user = this;
  userObject = user.toObject();
  return _.pick(userObject, ['username']);
}

UserSchema.pre('save', function(done){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, user.password, function(err, salt){
      bcrypt.hash(user.password, salt, function(err, hash){
        user.password = hash;
        return done();
      });
    });
  }
  else {
    done();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
