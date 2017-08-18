const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {Task} = require('./../server/models/task');

const {populateTasks, tasks} = require('./seed/seed');

var app = require('./../app').app;

beforeEach(populateTasks);

describe('GET /tasks tests', function(){
  it('should return a list of tasks', function(done){
    request(app)
      .get("/tasks")
      .expect(200)
      .end((err, res) => {
        if (err){
          done(err);
        }
        Task.find()
          .then((tasks) => {
            expect(tasks.length).toBe(2);
            expect(tasks[0].title).toEqual('Learn guitar');
            expect(tasks[0].goalTime).toEqual(50000);
            done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
});

describe('POST /tasks tests', function(){
  it('should post a new task and redirect successfully', function(done){
    request(app)
      .post("/tasks")
      .type('form')
      .send('titleTsk=Learn to speak the language of the trees')
      .expect(302)
      .expect('Location', '/tasks')
      .end((err, res) => {
        if (err){
          return done(err);
        }
        Task.find()
          .then((tasks) => {
            expect(tasks.length).toBe(3);
            return done();
          })
          .catch((e) => {
            return done(e);
          });
      });
  });
  it('should not add a task with invalid data', function(done) {
    request(app)
      .post("/tasks")
      .type('form')
      .send('titleTsk=')
      .expect(400)
      .end((err, res) => {
        if (err){
          return done(err);
        }
        Task.find()
          .then((tasks) => {
            expect(tasks.length).toBe(2);
            return done();
          })
          .catch((e) => {
            done(e);
          })
      })
  });
});

describe('GET /tasks/:id tests', function(){
  it('should return a valid task when valid ID is used', function(done){
    request(app)
      .get(`/tasks/${tasks[0]._id.toHexString()}`)
      .expect(200)
      .end(done);
  });
  it('should not return a valid task when valid ID is NOT used', function(done){
    request(app)
      .get(`/tasks/marcus`)
      .expect(404)
      .end(done);
  });
  it('should not return a valid task when matching ID is not found', function(done){
    request(app)
      .get(`/tasks/${new ObjectID()}`)
      .expect(400)
      .end(done);
  });
});
describe('PUT /tasks/:id tests', function(){
  it('should return a 400 if put used on invalid ID', function(done){
    request(app)
      .put(`/tasks/dfnd`)
      .expect(400)
      .end((err, res) => {
        if (err){
          return done(err);
        }
        done();
      })
  });
  it('should not update a task when matching ID is not found', function(done){
    request(app)
      .put(`/tasks/${new ObjectID()}`)
      .expect(404)
      .end(done);
  });
  it('should add a note to a task', function(done) {
    var id = tasks[0]._id.toHexString();
    var note = 'Working diligently on this duty I have self assigned';

    request(app)
      .put(`/tasks/${id}`)
      .send('noteBody=' + note)
      .expect(302)
      .expect('Location', `/tasks/${id}`)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Task.findOne({_id: id})
          .then((task) => {
            expect(task.notes[0].body).toBe(note)
            done();
          })
          .catch((e) => {
            done(e);
          })
      });
  });
  it('should edit the title of a task', function(done){
    var id = tasks[0]._id.toHexString();
    var taskTitle = 'Work on my masterpiece';
    request(app)
      .put(`/tasks/${id}`)
      .send('editTitleTsk=' + taskTitle)
      .expect(302)
      .expect('Location', `/tasks/${id}`)
      .end((err, res) => {
        if (err){
          return done(err)
        }
        Task.findOne({_id: id})
          .then((task) => {
            expect(task.title).toBe(taskTitle);
            done();
          })
          .catch((e) => {
            return done(e);
          });
      });
  });
  it('should edit the start time of a task', function(done){
    var id = tasks[0]._id.toHexString();
    request(app)
      .put(`/tasks/${id}`)
      .send('startTsk=START')
      .expect(302)
      .expect('Location', `/tasks/${id}`)
      .end((err, res) => {
        if (err){
          return done(err);
        }
        Task.findOne({_id: id})
          .then((task) => {
            expect(task.startTime).toNotBe(0);
            return done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
  it('should stop a task', function(done){
    var id = tasks[0]._id.toHexString();
    request(app)
      .put(`/tasks/${id}`)
      .send('stopTsk=STOP')
      .expect(302)
      .expect('Location', `/tasks/${id}`)
      .end((err, res) => {
        if (err){
          return done(err);
        }
        Task.findOne({_id: id})
          .then((task) => {
            expect(task.time).toNotBe(0);
            return done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
});
describe('DELETE /tasks/:id route tests', function(){
  it('should delete a task', function(done){
    var id = tasks[1]._id.toHexString();
    request(app)
      .delete(`/tasks/${id}`)
      .expect(302)
      .expect('Location', '/tasks')
      .end((err, res) => {
        if (err){
          return done(err);
        }
        Task.findOne({_id: id})
          .then((task) => {
            expect(task).toNotExist();
            return done();
          })
          .catch((e) => {
            done(e)
          });
      });
  });
})
