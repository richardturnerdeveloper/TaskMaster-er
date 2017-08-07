var express = require('express')
, router = express.Router();

var {Todo} = require('./../server/models/todo');
const {mongoose} = require('./../server/db/mongoose');
var {ObjectID} = require('mongodb');
const conv = require('./../lib/conv');

//VIEW TODOS
router.get("/", (req, res) => {
  Todo.find().sort({_id: -1}).then((todos) => {
      res.status(200).render('todos', {todos});
  }).catch((e) => {
    res.status(404).render('lost', {
      errMessage: 'could not find any TODO items',
      url: '/todos'
    });
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
    }).catch((e) => {
      res.status(404).render('lost', {
        errMessage: 'could not add that Todo! Please try again.',
        url: '/todos'
      });
    });
  }
});
//COMPLETE A todo
router.put("/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    res.status(400).render('lost', {
      errMessage: 'that is not a valid ID!',
      url: '/todos'
    });
  }
  Todo.findByIdAndUpdate(id, {$set: {completed: true, color: 'green'}}).then((todo) => {
    res.redirect("/todos");
  }).catch((e) => {
    res.status(404).render('lost', {
      errMessage: 'that TODO could not be updated at this time! Woopsie!',
      url: '/todos'
    });
  });
});
//DELETE A todo
router.delete('/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    res.status(400).render('lost', {
      errMessage: 'that is not a valid ID!',
      url: '/todos'
    });
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    res.redirect("/todos");
  }).catch((e) => {
    res.status(400).render('lost', {
      errMessage: 'could not remove that todo at this time!',
      url: '/todos'
    });
  });

});
module.exports = router;
