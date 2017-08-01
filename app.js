const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get("/home", (req, res) => {
  res.render('home');
});

app.get("/task-masterer", (req, res) => {
  res.render('task-masterer');
});

app.listen(3000, () => {
  console.log('Server running');
});
