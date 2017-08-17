const express = require('express');
const methodOverride = require('method-override');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const {Task} = require('./server/models/task');
const {Todo} = require('./server/models/todo');

const {env, port} = require('./server/config');

var app = express();

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

hbs.registerPartials(__dirname + '/views/partials');
//------- HELPER FUNCTIONS -----------//
hbs.registerHelper('viewHours', function(difference){
  difference = difference * 0.001; //convert milliseconds to seconds
  difference = difference * 0.0166667; //convert seconds to minutes
  difference = difference * 0.0166667; //convert minutes to hours
  if (difference > 10000){
    difference = Math.floor(difference);
  }
  return difference.toFixed(3);
});
hbs.registerHelper('goalPercent', function(time, goalTime) {
  var percentage = time / goalTime;
  percentage = percentage * 100;
  return percentage.toFixed(0);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

//---------ROUTES --------- //
app.use('/tasks', require('./routes/tasks'));
app.use('/todos', require('./routes/todos'));

app.get("/", (req, res) => {
  Task.find().then((tasks) => {
    Todo.find().then((todos) => {
      res.status(200).render('home', {
        tasks: tasks.length,
        todos: todos.length,
      })
    });
  }).catch((e) => {
    res.status(404).render('lost', {
      errMessage: 'Something went really really wrong!',
      url: '/'
    });
  });
});

app.get("/about", (req, res) => {
  res.status(200).render('about');
});

app.get("/lost", (req, res) => {
  res.render("lost", {
    errMessage: 'Something went wrong!',
    url: '/'
  });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

module.exports.app = app;
