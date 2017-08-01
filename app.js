const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get("/home", (req, res) => {
  res.render('home');
});

app.get("/task-masterer", (req, res) => {
  res.render('task-masterer');
});

app.post("/task-masterer", (req, res) => {
  console.log('Redirecting!');
  if (req.body.startTsk){
    console.log('Starting task!');
    res.redirect("/task-masterer");
  } else if (req.body.stopTsk){
    console.log('Stopping test!');
    res.redirect("/task-masterer");
  } else {
    res.redirect("lost");
  }
});

app.listen(3000, () => {
  console.log('Server running');
});
