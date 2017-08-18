const {Task} = require('./../../server/models/task');
const {Todo} = require('./../../server/models/todo');
const {ObjectID} = require('mongodb');

firstObjectID = new ObjectID();
secondObjectID = new ObjectID();
thirdObjectID = new ObjectID();
fourthObjectID = new ObjectID();

const todos = [
  {
    _id: firstObjectID,
    title: 'Go to work'
  },
  {
    _id: secondObjectID,
    title: 'Eat icecream'
  }
];

const tasks = [
  {
    _id: thirdObjectID,
    title: 'Learn guitar',
    goalTime: 50000,
    notes: [{
      body: 'Doing good'
    }]
  },
  {
    _id: fourthObjectID,
    title: 'Go to school'
  }
]

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => {
      return done();
    })
    .catch((e) => {

    });
}

const populateTasks = (done) => {
  Task.remove({})
    .then(() => {
      return Task.insertMany(tasks);
    })
    .then(() => {
      return done();
    })
    .catch((e) => {

    });
}

module.exports = {
  populateTasks,
  populateTodos,
  todos,
  tasks
  };
