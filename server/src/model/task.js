'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: [true, 'Task name is required'],
    trim: true
  },
  hours: {
    type: String,
    default: '00',
    required: [true, 'The field hours is required'],
    trim: true
  },
  minutes: {
    type: String,
    default: '00',
    required: [true, 'The field minutes is required'],
    trim: true
  },
  seconds: {
    type: String,
    default: '00',
    required: [true, 'The field seconds is required'],
    trim: true
  },
  new: {
    type: Boolean,
    required: [true, 'The field new is required'],
    default: true
  },
  stopped: {
    type: Boolean,
    required: [true, 'The field stopped is required'],
    default: false
  },
  done: {
    type: Boolean,
    required: [true, 'The field done is required'],
    default: false
  }
});

module.exports = mongoose.model('Task', schema);
