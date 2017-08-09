const express = require('express');
const methodOverride = require('method-override');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const {Task} = require('./server/models/task');
const {Todo} = require('./server/models/todo');
const {asyncDayLight} = require('./lib/hours');
const helpers = require('./lib/helpers');
var app = express();

console.log(helpers.viewHours(4543857439584));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('viewHours', helpers.viewHours);
hbs.registerHelper('goalPercent', helpers.goalPercent);

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

//---------ROUTES --------- //
app.use('/tasks', require('./routes/tasks'));
app.use('/todos', require('./routes/todos'));

app.get("/", (req, res) => {
  Task.find().then((tasks) => {
    Todo.find().then((todos) => {
      var totalHours = "";
      var hours = asyncDayLight().then((doc) => {
        res.status(200).render('home', {
          tasks: tasks.length,
          todos: todos.length,
          hours: doc,
          today: new Date().toString().substr(0,15)
        });
      }).catch((e) => {
        res.status(404).render('lost', {
          errMessage: 'there was an ERROR fectching daylight hours.',
          url: '/'
        });
      });

    });
  }).catch((e) => {
    res.status(404).render('lost', {
      errMessage: 'Something went really really wrong!',
      url: '/'
    });
  });
});

app.get("/about", (req, res) => {
  res.render('about');
});

app.get("/lost", (req, res) => {
  res.render("lost", {
    errMessage: 'Something went wrong!',
    url: '/'
  });
});

app.listen(3000, () => {
  console.log('Server running');
});
