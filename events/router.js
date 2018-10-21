'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const jwtAuth = passport.authenticate('jwt', {session: false});

const {Event} = require('./models');

const jsonParser = bodyParser.json();


router.get('/events', (req, res) => {
  Event
    .find()
    .then(events => {
      res.status(200).json(wines)
    })
    .catch(err=> {
      res.status(500).json({message: "Internal Server Error"});
    });
});

router.get('/events/:id', (req, res) => {
  Event
    .findById(req.params.id)
    .then(event => {
      res.status(200).json(wine)
    })
    .catch(err=> {
      res.status(500).json({message: "Internal Server Error"});
    });
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['organizer', 'title', 'location', 'date', 'start_time', 'end_time', 'capacity'];
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
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});

router.get('/', (req, res) => {
  return Event.find()
    .then(events => res.json(events))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
