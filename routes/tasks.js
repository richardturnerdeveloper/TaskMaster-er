var express = require('express')
, router = express.Router();

var {Task} = require('./../server/models/task');
const {mongoose} = require('./../server/db/mongoose');
var {ObjectID} = require('mongodb');
const conv = require('./../lib/conv');

//LIST TASKS
router.get("/", (req, res) => {
  Task.find().then((tasks) => {
    if (tasks.length === 0){
      return res.status(200).render('tasks', {
        title: 'No tasks yet! Click the green button to add one.'
      });
    }
    res.status(200).render("tasks", {
      tasks
    });
  }).catch((e) => {
    res.status(404).render("lost", {
      errMessage: 'there were no tasks in the database.',
      url: '/tasks'
    });
  });
});
//ADD A NEW TASK
router.post("/", (req, res) => {
  if (req.body.goalNum){
    var target = req.body.goalNum;
    target = target * 60;
    target = target * 60;
    target = target * 1000;
  }
  var newTask = new Task({
    title: req.body.titleTsk.toUpperCase(),
    goalTime: target
  });
  newTask.save().then((task) => {
    res.redirect("/tasks");
  }).catch((e) => {
    res.status(404).render("lost", {
      errMessage: 'a task by the name could not be created.',
      url: '/tasks'
    });
  });
});
//INDIVIDUAL TASK PAGE
router.get("/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).render('lost', {
      errMessage: 'that is not a valid ID!',
      url: '/tasks'
    });
  }
  Task.findById(id).then((task) => {
      if(!task){
        return res.status(404).render('lost', {
          errMessage: 'we could not find that task!',
          url: '/tasks'
        });
      }
      res.status(200).render("task",{
        task
      });
  }).catch((e) => {
    res.status(404).render("lost", {
      errMessage: 'that particular task does not exist. Really sorry and all!',
      url: '/tasks'
    });
  });
});

//PATCH ROUTES

router.put("/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).render('lost', {
      errMessage: 'that is not a valid ID!',
      url: '/tasks'
    });
  }
  //IF note ADDED
  if (req.body.noteBody){
    var newNote = {
      body: req.body.noteBody
    }
    Task.findByIdAndUpdate(id, {$push: {notes: newNote}}).then((note) => {
      res.redirect('/tasks/' + id);
    }).catch((e) => {
      res.status(404).render('lost', {
        errMessage: 'that task could not be updated at this time.',
        url: '/tasks'
      });
    });
  }
  //IF TITLE IS EDITED
  if (req.body.editTitleTsk){
    Task.findByIdAndUpdate(id, {$set: {title: req.body.editTitleTsk}}).then((task) => {
      res.redirect('/tasks/' + id);
    }).catch((e) => {
      res.status(404).render('lost', {
        errMessage: 'that task could not be updated at this time.',
        url: '/tasks'
      });
    });
  }
  // IF START BUTTON WAS CLICKED
  if (req.body.startTsk){
    Task.findByIdAndUpdate(id, {$set: {startTime: conv.taskCount(), inProgress:true}}).then((task) => {
      res.redirect('/tasks/' + id);
    }).catch((e) => {
      res.status(404).render('lost', {
        errMessage: 'that task could not be updated at this time.',
        url: '/tasks'
      });
    });
  }
  // IF STOP WAS CLICKED
  else if (req.body.stopTsk){
    Task.findById(id).then((task) => {
      //PREPARE DATA TO UPDATE TASK
      var data = {
        start: task.startTime,
        time: task.time,
        stop: conv.taskCount()
      }
      data.difference = data.stop - data.start;
      return data;
    }).then((data) => {
      // USE DATA TO UPDATE TOTAL TIME
      var newTime = data.time + data.difference;
      Task.findByIdAndUpdate(id, {$set: {time: newTime, inProgress:false}}).then((task) => {
        res.redirect('/tasks/' + id);
      }).catch((e) => {
        res.status(404).render('lost', {
          errMessage: 'that task could not be updated at this time.',
          url: '/tasks'
        });
      });
    }).catch((e) => {
      res.status(404).render('lost', {
        errMessage: 'that task could not be updated at this time.',
        url: '/tasks'
      });
    });
  }
});

//DELETE ROUTE
router.delete("/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).render('lost', {
      errMessage: 'that is not a valid ID!',
      url: '/tasks'
    });
  }
  Task.findByIdAndRemove(id).then((task) => {
    res.redirect("/tasks");
  }).catch((e) => {
    res.status(404).render('lost', {
      errMessage: 'that task could not be deleted at this time.',
      url: '/tasks'
    });
  });
});

module.exports = router;
