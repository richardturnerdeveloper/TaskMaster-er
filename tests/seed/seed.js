const {Task} = require('./../../server/models/task');
const {Todo} = require('./../../server/models/todo');
const {User} = require('./../../server/models/user');
const {ObjectID} = require('mongodb');

firstObjectID = new ObjectID();
secondObjectID = new ObjectID();
thirdObjectID = new ObjectID();
fourthObjectID = new ObjectID();
fifthObjectID = new ObjectID();
sixthObjectID = new ObjectID();

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

const users = [
  {
    _id: fifthObjectID,
    username: 'I_Like_Browsing',
    email: 'I_Like_Browsing@internet.com',
    password: 'xXxmarilynMansonfanxXx',
    tokens: []
  },
  {
    _id: sixthObjectID,
    username: 'DogFoodEater',
    email: 'PurinaIsChoice@dogs.org',
    password: 'raiseawareness1',
    tokens: []
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
const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      return User.insertMany(users);
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
  populateUsers,
  users,
  todos,
  tasks
  };
