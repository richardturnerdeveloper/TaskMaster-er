const {Task} = require('./../server/models/task');
const {ObjectID} = require('mongodb');
const conv = require('./conv');

function addNote(note, id){
  var newNote = {
    body: note
  }
  return Task.findByIdAndUpdate(id, {$push:
      {
        notes: {
          $each: [newNote],
          $position: 0
        }
      }
    });
}

module.exports = {addNote};
