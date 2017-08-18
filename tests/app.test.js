const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../server/models/todo');
const {Task} = require('./../server/models/task');

const {populateTodos, populateTasks, todos, tasks} = require('./seed/seed');

var app = require('./../app').app;

beforeEach(populateTodos);
beforeEach(populateTasks);



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
