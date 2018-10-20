'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//TODO need to change to events schema
const EventSchema = mongoose.Schema({
  Eventname: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});

EventSchema.methods.serialize = function() {
  return {
    Eventname: this.Eventname || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

const Event = mongoose.model('Event', EventSchema);

module.exports = {Event};
