const request = require('supertest');
const expect = require('expect');

var app = require('./../app').app;


  describe('/ route tests', function(){
    it('should return a 200 status code', function(done) {
      request(app)
        .get("/")
        .expect(200)
        .end((err, res) => {
          if (err){
            return done(err);
          }
          done();
        });
    });
  });
