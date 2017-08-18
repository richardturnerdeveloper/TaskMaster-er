const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {User} = require('./../server/models/user');

const {populateUsers, users} = require('./seed/seed');

beforeEach(populateUsers);

var app = require('./../app').app;

describe('GET /users route tests', function(){
  it('should return a list of users', function(done){
    request(app)
      .get('/users')
      .expect(200)
      .end((err, res) => {
        if (err){
          return done(err);
        }
        done();
      });
  });
  it('should return a 404 when no users exist', function(done){
    User.remove({}).then(() => {
      request(app)
        .get('/users')
        .expect(404)
        .end((err, res) => {
          if (err){
            return done(err);
          }
          expect(res.body.length).toNotExist();
          done();
        });
    })
    .catch((e) => {
      console.log(e);
    });
  });
});
describe('POST /users route tests', function(){
  it('should add a new user', function(done){
    request(app)
      .post('/users')
      .send('username=DoNOTeatDOGFOOD')
      .send('email=itsbadforyou@truth.org')
      .send('password=secretlyilovedogfood420')
      .expect(302)
      .expect('Location', '/users')
      .end((err, res) => {
        if (err){
          return done(err);
        }
        User.find()
          .then((users) => {
            expect(users.length).toBe(3);
            expect(users[2].username).toBe('DoNOTeatDOGFOOD');
            return done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
  it('should NOT add a new user when an invalid email is used', function(done){
    request(app)
      .post('/users')
      .send('username=DoNOTeatDOGFOOD')
      .send('email=itsbadforyou')
      .send('password=secretlyilovedogfood420')
      .expect(400)
      .end((err, res) => {
        if (err){
          return done(err);
        }
        User.find()
          .then((users) => {
            expect(users.length).toBe(2);
            return done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
  it('should not add users with duplicate data', function(done){
    request(app)
      .post('/users')
      .send('username=DogFoodEater')
      .send('email=PurinaIsChoice@dogs.org')
      .send('password=secretlyilovedogfood420')
      .expect(400)
      .end((err, res) => {
        if (err){
          return done(err);
        }
        User.find()
          .then((users) => {
            expect(users.length).toBe(2);
            return done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
  it('should not add a user when data is missing', function(done){
    request(app)
      .post('/users')
      .send('username=DogFoodEater')
      .send()
      .send('password=secretlyilovedogfood420')
      .expect(400)
      .end((err, res) => {
        if (err){
          return done(err);
        }
        User.find()
          .then((users) => {
            expect(users.length).toBe(2);
            return done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
  it('should not store a plain text password when adding a user', function(done){
    request(app)
      .post('/users')
      .send('username=DoNOTeatDOGFOOD')
      .send('email=itsbadforyou@truth.org')
      .send('password=secretlyilovedogfood420')
      .expect(302)
      .expect('Location', '/users')
      .end((err, res) => {
        if (err){
          return done(err);
        }
        User.findOne({username: 'DoNOTeatDOGFOOD'})
          .then((user) => {
            expect(user.password).toNotBe('secretlyilovedogfood420');
            done();
          });
      });
  });
});
