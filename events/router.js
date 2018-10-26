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


router.get('/', (req, res) => {
  Event
    .find()
    .then(events => {
      res.status(200).json(events)
    })
    .catch(err=> {
      res.status(500).json({message: "Internal Server Error"});
    });
});

router.get('/:user', (req, res) => {
  Event
    .find({$or: [{organizer:req.params.user}, {attendees: req.params.user}]})
    .then(event => {
      res.status(200).json(event)
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

  let {organizer, title, description, location, date, start_time, end_time, capacity, attendees} = req.body; 
    return Event.create(req.body)
  .then(event => {
    return res.status(201).json(event);
  })
  .catch(err => {
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    console.log(err);
    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});

router.delete('/:id', (req, res) => {
  Event
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => {
      res.status(500).json({message: "Internal Server Error"})
    })
});

router.put('/:id', (req, res) => {

  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path ID (${req.params.id}) and request body ID (${req.body.id}) must match`
      );
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ["title", "description", "date", "start_time", "end_time", "capacity"]

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Event
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(() => {
    res.status(204).end()
    })
  .catch(err => {
    res.status(500).json({message: "Internal Error"})
  })
})

module.exports = {router};
