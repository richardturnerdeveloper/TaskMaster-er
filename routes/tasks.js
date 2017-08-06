var express = require('express')
, router = express.Router();

var {Task} = require('./../server/models/task');
const {mongoose} = require('./../server/db/mongoose');
var {ObjectID} = require('mongodb');
const conv = require('./../lib/conv');

//LIST TASKS
router.get("/", (req, res) => {
  Task.find().then((tasks) => {
    res.render("tasks", {
      tasks
    });
  }).catch((e) => {
    res.redirect("/lost");
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
    title: req.body.titleTsk,
    goalTime: target
  });
  newTask.save().then((task) => {
    res.redirect("/tasks");
  }).catch((e) => {
    console.log(e);
    res.redirect("/lost");
  });
});
//INDIVIDUAL TASK PAGE
router.get("/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).send('Object ID not valid!');
  }
  Task.findById(id).then((task) => {
      res.render("task",{
        task
      });
  }).catch((e) => {
    console.log(e);
    res.redirect("/lost");
  });
});

//PATCH ROUTES

router.put("/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).send('Object ID not valid!');
  }
  //IF TITLE IS EDITED
  if (req.body.editTitleTsk){
    Task.findByIdAndUpdate(id, {$set: {title: req.body.editTitleTsk}}).then((task) => {
      res.redirect('/tasks/' + id);
    }).catch((e) => {
      res.send(e);
    });
  }
  // IF START BUTTON WAS CLICKED
  if (req.body.startTsk){
    Task.findByIdAndUpdate(id, {$set: {startTime: conv.taskCount(), inProgress:true}}).then((task) => {
      res.redirect('/tasks/' + id);
    }).catch((e) => {
      res.send(e);
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
        res.redirect('lost');
      });
    }).catch((e) => {
      res.redirect('lost');
    });
  }
});

//DELETE ROUTE
router.delete("/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).send('Object ID not valid!');
  }
  Task.findByIdAndRemove(id).then((task) => {
    console.log(`${task} removed!`);
    res.redirect("/tasks");
  }).catch((e) => {
    res.redirect("/lost");
  });
});

module.exports = router;
