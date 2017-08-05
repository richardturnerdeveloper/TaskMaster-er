const express = require('express');
const methodOverride = require('method-override');
const hbs = require('hbs');
const bodyParser = require('body-parser');

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
app.use('/tasks', require('./routes/tasks'));

app.get("/", (req, res) => {
  res.render('home');
});

app.get("/lost", (req, res) => {
  res.render("lost");
});

app.listen(3000, () => {
  console.log('Server running');
});
