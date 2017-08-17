const request = require('supertest');
const expect = require('expect');

const {Todo} = require('./../server/models/todo');
const {Task} = require('./../server/models/task');

const todos = [
  {
    title: 'Go to work'
  },
  {
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

beforeEach(populateTodos);
beforeEach(populateTasks);

var app = require('./../app').app;


  describe('Root route tests', function(){
    it('GET / should return a list of Todos and Tasks', function(done) {
      request(app)
        .get("/")
        .expect(200)
        .end((err, res) => {
          if (err){
            return done(err);
          }
          var task1 = Todo.find();
          var task2 = Task.find();
          Promise.all([task1, task2]).then((values) => {
            expect(values.length).toBe(2);
            done();
          });
        });
    });
    it('GET /about should return a 200 status code', function(done) {
      request(app)
        .get("/about")
        .expect(200)
        .end(done);
    });
    it('GET /lost should return a 404 status code', function(done){
      request(app)
        .get("/lost")
        .expect(404)
        .end(done);
    });
  });
  describe('GET /todos tests', function(){
    it('should return a list of todos', function(done){
      request(app)
        .get("/todos")
        .expect(200)
        .end((err, res) => {
          if (err){
            done(err);
          }
          Todo.find()
            .then((todos) => {
              expect(todos.length).toBe(2);
              expect(todos[0].title).toEqual('Go to work');
              done();
            })
            .catch((e) => {
              done(e);
            });
        });
    });
  });
  describe('POST /todos tests', function(){
    it('should post a new todo', function(done){

      request(app)
        .post("/todos")
        .send('titleTodo=Eat cat')
        .expect(200)
        .end((err, res) => {
          if (err){
            done(err);
          }
          Todo.find()
            .then((todos) => {
              expect(todos.length).toBe(3);
              console.log(todos);
              
              done();
            })
            .catch((e) => {
              done(e);
            });

        })
    });
  });
