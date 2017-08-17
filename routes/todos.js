const express = require('express')
, router = express.Router();

const {env, port, mongoose} = require('./../server/config');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../server/models/todo');
const conv = require('./../lib/conv');

//VIEW TODOS
router.get("/", (req, res) => {
  Todo.find().sort({_id: -1}).then((todos) => {
    if (todos.length === 0){
      return res.status(200).render('todos', {message: 'No todos yet.  Click the button above to add one!'});
    }
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
  var newTodo = new Todo(req.body);
  newTodo.save()
    .then((todo) => {
      res.status(200).send(todo);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});
//COMPLETE A todo
// router.put("/:id", (req, res) => {
//   var id = req.params.id;
//   if (!ObjectID.isValid(id)){
//     res.status(400).render('lost', {
//       errMessage: 'that is not a valid ID!',
//       url: '/todos'
//     });
//   }
//   Todo.findByIdAndUpdate(id, {$set: {
//       completed: true,
//       color: 'green',
//       dateCompleted: new Date().toString().substr(0,15)
//     }}).then((todo) => {
//     res.redirect("/todos");
//   }).catch((e) => {
//     res.status(404).render('lost', {
//       errMessage: 'that TODO could not be updated at this time! Woopsie!',
//       url: '/todos'
//     });
//   });
// });
// //DELETE A todo
// router.delete('/:id', (req, res) => {
//   var id = req.params.id;
//   if (!ObjectID.isValid(id)){
//     res.status(400).render('lost', {
//       errMessage: 'that is not a valid ID!',
//       url: '/todos'
//     });
//   }
//   Todo.findByIdAndRemove(id).then((todo) => {
//     res.redirect("/todos");
//   }).catch((e) => {
//     res.status(400).render('lost', {
//       errMessage: 'could not remove that todo at this time!',
//       url: '/todos'
//     });
//   });
// });
module.exports = router;
