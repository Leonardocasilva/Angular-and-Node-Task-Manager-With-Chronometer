'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');

const app = express();
const router = express.Router();

mongoose.connect('mongodb+srv://dev:Desenv*123@desenv-qtvxe.gcp.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const Task = require('./model/task');

const indexRoute = require('./routes/index-router');
const tasksRoute = require('./routes/tasks-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/', indexRoute);
app.use('/tasks', tasksRoute);

const Emitter = require('./config/listen');
const emmiter = Emitter.emitter;


setInterval(() => {
  emmiter.emit('init', () => {
    return;
  })
}, 1000);

module.exports = app;
