const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {Task} = require('./../server/models/task');

const {populateTasks, tasks} = require('./seed/seed');

beforeEach(populateTasks);

var app = require('./../app').app;
