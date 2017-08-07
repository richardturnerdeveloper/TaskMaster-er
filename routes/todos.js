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
//COMPLETE A todo
router.put("/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).send('Object ID not valid!');
  }
  Todo.findByIdAndUpdate(id, {$set: {completed: true, color: 'green'}}).then((todo) => {
    res.redirect("/todos");
  }).catch((e) => {
    res.redirect("/lost");
  });
});
//DELETE A todo
router.delete('/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).send('Object ID not valid!');
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    res.redirect("/todos");
  }).catch((e) => {
    res.redirect("lost");
  });

});
module.exports = router;
