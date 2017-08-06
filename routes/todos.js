var express = require('express')
, router = express.Router();

var {Todo} = require('./../server/models/todo');
const {mongoose} = require('./../server/db/mongoose');
var {ObjectID} = require('mongodb');
const conv = require('./../lib/conv');
//VIEW TODOS
router.get("/", (req, res) => {
  Todo.find().then((todos) => {
      res.render('todos', {todos});
  }).catch((e) => {
    res.redirect('lost');
  })

});
//ADD A todo
router.post("/", (req, res) => {
  if (req.body.titleTodo){
    var newTodo = new Todo({
      title: req.body.titleTodo.toUpperCase()
    });
    newTodo.save().then((todo) => {
      res.redirect("/todos");
    });
  }
});

module.exports = router;
