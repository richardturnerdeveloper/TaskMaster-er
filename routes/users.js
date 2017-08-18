var express = require('express')
, router = express.Router();

const {env, port, mongoose} = require('./../server/config');
const {ObjectID} = require('mongodb');

const {User} = require('./../server/models/user');
const conv = require('./../lib/conv');

const _ = require('lodash');
// ---------- USERS GET ROUTE ---------//
router.get("/", (req, res) => {
  User.find()
    .then((users) => {
      if (users.length === 0){
        res.status(404).send();
      }
      return res.status(200).send(users);
    })
    .catch((e) => {
      return res.status(404).send();
    });
});
// ---------- USERS POST ROUTE ------------//
router.post("/", (req, res) => {
  var body = _.pick(req.body, ['username', 'password', 'email']);
  if (!req.body.username || !req.body.password || !req.body.email){
    return res.status(400).render('lost', {
      errMessage: 'that was not valid user data!',
      url: '/'
    });
  }
  var newUser = new User(body);

  User.findOne({username: body.username})
    .then((user) => {
      if (!user){
        newUser.save()
          .then((user) => {
            return res.send(user);
          })
          .catch((e) => {
            return res.status(400).render('lost', {
              errMessage: 'that was not valid user data!',
              url: '/'
            });
          });
      }
      else {
        return res.status(400).render('lost', {
          errMessage: 'a user with that name or email already exists!',
          url: '/'
        });
      }
    })
    .catch((e) => {
      res.redirect('/lost');
    });
});

module.exports = router;
