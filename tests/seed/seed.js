const {Task} = require('./../../server/models/task');
const {Todo} = require('./../../server/models/todo');
const {ObjectID} = require('mongodb');

firstObjectID = new ObjectID();
secondObjectID = new ObjectID();

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
    title: 'Learn guitar',
    goalTime: 50000,
    notes: [{
      body: 'Doing good'
    }]
  },
  {
    title: 'Go to school'
  }
]

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => {
      done();
    })
    .catch((e) => {
      return done(e);
    });
}

const populateTasks = (done) => {
  Task.remove({})
    .then(() => {
      return Task.insertMany(tasks);
    })
    .then(() => {
      done();
    })
    .catch((e) => {
      return done(e);
    });
}

module.exports = {
  populateTasks,
  populateTodos,
  todos,
  tasks
  };
