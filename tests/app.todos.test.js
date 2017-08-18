const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../server/models/todo');

const {populateTodos, todos} = require('./seed/seed');

beforeEach(populateTodos);

var app = require('./../app').app;

  describe('GET /todos tests', function(){
    it('should return a list of todos', function(done){
      request(app)
        .get("/todos")
        .expect(200)
        .end((err, res) => {
          if (err){
            return done(err);
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
    it('should post a new todo and redirect successfully', function(done){
      request(app)
        .post("/todos")
        .type('form')
        .send('titleTodo=Eat popcorn')
        .expect(302)
        .expect('Location', '/todos')
        .end((err, res) => {
          if (err){
            return done(err);
          }
          Todo.find()
            .then((todos) => {
              expect(todos.length).toBe(3);
              return done();
            })
            .catch((e) => {
              return done(e);
            });
        });
    });
    it('should not post a todo with invalid data', function(done){
      request(app)
        .post("/todos")
        .type('form')
        .send('eatHats=Good for mind')
        .expect(302)
        .expect('Location', '/lost')
        .end((err, res) => {
          if (err){
            done(err);
          }
          Todo.find()
            .then((todos) => {
              expect(todos.length).toBe(2);
              return done();
            })
            .catch((e) => {
              return done(e);
            });
        });
    })
  });
  describe('PUT /todos/:id route tests', function(){
    it('should update a todo', function(done){
      request(app)
        .put(`/todos/${todos[0]._id.toHexString()}`)
        .expect(302)
        .end((err, res) => {
          if (err){
            done(err);
          }
          Todo.findOne({title: 'Go to work'})
            .then((todo) => {
              expect(todo.completed).toBe(true);
              expect(todo.color).toBe('green');
              done();
            })
            .catch((e) => {
              done(e);
            });
          });
    });
    it('should not update a todo with no matching ID', function(done){
      request(app)
        .put(`/todos/` + new ObjectID())
        .expect(302)
        .end((err, res) => {
          if (err){
            return done(err);
          }
          Todo.find()
            .then((todo) => {
              expect(todo[0].completed).toBe(false);
              expect(todo[0].color).toBe('#333');
              expect(todo[1].completed).toBe(false);
              expect(todo[1].color).toBe('#333');
              done();
            })
            .catch((e) => {
              return done(e);
            });
          });
    });
    it('should not update a todo with an invalid ID', function(done){
      request(app)
        .put(`/todos/123`)
        .expect(400)
        .end((err, res) => {
          if (err){
            return done(err);
          }
          Todo.find()
            .then((todo) => {
              expect(todo[0].completed).toBe(false);
              expect(todo[0].color).toBe('#333');
              expect(todo[1].completed).toBe(false);
              expect(todo[1].color).toBe('#333');
              return done();
            })
            .catch((e) => {
              return done(e);
            });
          });
    });
  });
  describe('DELETE /todos tests', function(){
    it('should remove a todo', function(done){
      request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .expect(302)
        .end((err, res) => {
          if (err){
            return done(err);
          }
          Todo.findOne({title: 'Go to work'})
            .then((todo) => {
              expect(todo).toNotExist();
              return done();
            })
            .catch((e) => {
              return done(e);
            });
          });
    });
    it('should not remove a todo with no matching ID', function(done){
      request(app)
        .put(`/todos/` + new ObjectID())
        .expect(302)
        .end((err, res) => {
          if (err){
            return done(err);
          }
          Todo.find()
            .then((todos) => {
              expect(todos.length).toBe(2);
              return done();
            })
            .catch((e) => {
              return done(e);
            });
          });
    });
    it('should not remove a todo with an invalid ID', function(done){
      request(app)
        .put(`/todos/123`)
        .expect(400)
        .end((err, res) => {
          if (err){
            return done(err);
          }
          Todo.find()
            .then((todos) => {
              expect(todos.length).toBe(2);
              return done();
            })
            .catch((e) => {
              return done(e);
            });
          });
    });
  });
