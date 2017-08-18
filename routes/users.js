var express = require('express')
, router = express.Router();

const {env, port, mongoose} = require('./../server/config');
const {ObjectID} = require('mongodb');

const {User} = require('./../server/models/user');
const conv = require('./../lib/conv');

module.exports = router;
