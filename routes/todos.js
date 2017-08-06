var express = require('express')
, router = express.Router();

var {Todo} = require('./../server/models/todo');
const {mongoose} = require('./../server/db/mongoose');
var {ObjectID} = require('mongodb');
const conv = require('./../lib/conv');

router.get("/", (req, res) => {
  res.render('todos');
});

module.exports = router;
