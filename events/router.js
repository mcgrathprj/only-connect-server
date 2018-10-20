'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Event} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
//TODO rewrite for events
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['organizer', 'title', 'description', 'location', 'start_time', 'end_time'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  let {organizer, title, description, location, date, start_time, end_time, capacity} = req.body; 
    return Event.create(req.body)
  .then(event => {
    return res.status(201).json(event);
  })
  .catch(err => {
    // Forward validation errors on to the client, otherwise give a 500
    // error because something unexpected has happened
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});
// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
