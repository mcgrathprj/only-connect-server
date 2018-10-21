'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const EventSchema = mongoose.Schema({
  organizer: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: true
  },
    date: {
    type: Date,
    required: true
  },
    start_time: {
    type: String,
    required: true
  },
    end_time: {
    type: String,
    required: true
  },
    capacity: {
    type: Number,
    required: true
  },
    attendees: {
    type: Array,
    required: false
  }
});

const Event = mongoose.model('Event', EventSchema);

module.exports = {Event};
