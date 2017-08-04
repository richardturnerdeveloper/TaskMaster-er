const express = require('express');
const methodOverride = require('method-override');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
const {mongoose} = require('./server/db/mongoose');
const {ObjectID} = require('mongodb');
const {Task} = require('./server/models/task');
const conv = require('./lib/conv');

var app = express();

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('viewHours', function(difference){
  difference = difference * 0.001; //convert milliseconds to seconds
  difference = difference * 0.0166667; //convert seconds to minutes
  difference = difference * 0.0166667; //convert minutes to hours
  return difference.toFixed(3);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');


//---------ROUTES --------- //

app.get("/", (req, res) => {
  res.redirect("/task-masterer");
});
//LIST TASKS
app.get("/task-masterer", (req, res) => {
  Task.find().then((tasks) => {
    res.render("task-masterer", {
      tasks
    });
  }).catch((e) => {
    res.redirect("/lost");
  });
});
//ADD A NEW TASK
app.post("/task-masterer", (req, res) => {
  var newTask = new Task({
    title: req.body.titleTsk
  });
  newTask.save().then((task) => {
    res.redirect("/task-masterer");
  }).catch((e) => {
    console.log(e);
    res.redirect("/lost");
  });
});
//INDIVIDUAL TASK PAGE
app.get("/task-masterer/:id", (req, res) => {
  var id = req.params.id;
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

app.put("/task-masterer/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).send('Object ID not valid!');
  }
  // IF START BUTTON WAS CLICKED
  if (req.body.startTsk){
    Task.findByIdAndUpdate(id, {$set: {startTime: conv.taskCount()}}).then((task) => {
      res.redirect('/task-masterer/' + id);
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
      Task.findByIdAndUpdate(id, {$set: {time: newTime}}).then((task) => {
        res.redirect('/task-masterer/' + id);
      }).catch((e) => {
        res.redirect('lost');
      });
    }).catch((e) => {
      res.redirect('lost');
    });
  }
});

//DELETE ROUTE
app.delete("/task-masterer/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).send('Object ID not valid!');
  }
  Task.findByIdAndRemove(id).then((task) => {
    console.log(`${task} removed!`);
    res.redirect("/task-masterer");
  }).catch((e) => {
    res.redirect("/lost");
  });
});

app.get("/lost", (req, res) => {
  res.render("lost");
});

app.listen(3000, () => {
  console.log('Server running');
});
