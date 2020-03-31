"use strict";

const mongoose = require("mongoose");
const Task = mongoose.model("Task");

exports.post = (req, res, next) => {
  var task = new Task();

  task.name = req.body.name;
  task.seconds = req.body.seconds;
  task.minutes = req.body.minutes;
  task.hour = req.body.hour;

  task
    .save()
    .then(x => {
      res.status(201).send({
        title: "Task created",
        message: "Your task was created with success!"
      });
    })
    .catch(e => {
      res.status(400).send({
        message: "Look`s like something went wrong!",
        error: e
      });
    });
};

exports.put = (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name
    }
  })
    .then(result => {
      res.status(200).send({
        title: "Task updated",
        message: "Your task was updated with success!"
      });
    })
    .catch(e => {
      res.status(400).send({
        message: "Look`s like something went wrong!",
        error: e
      });
    });
};

exports.gets = (req, res, next) => {
  Task.find({})
    .then(data => {
      res.status(200).send(data);
    })
    .catch(e => {
      res.status(400).send({
        message: "Look`s like something went wrong!",
        error: e
      });
    });
};

exports.get = (req, res, next) => {
  Task.find({ _id: req.params.id })
    .then(data => {
      res.status(200).send(data);
    })
    .catch(e => {
      res.status(400).send({
        message: "Look`s like something went wrong!",
        error: e
      });
    });
};

exports.time = (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, {
    $set: {
      hours: req.body.hours,
      minutes: req.body.minutes,
      seconds: req.body.seconds
    }
  })
    .then(result => {
      res.status(200).send({});
    })
    .catch(e => {
      res.status(400).send({
        message: "Look`s like something went wrong!",
        error: e.message
      });
    });
};

exports.start = (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, {
    $set: {
      new: false,
      stopped: false
    }
  })
    .then(result => {
      Task.find({}).then( result => {
        res.status(200).send(result);
      }).catch(e => {
        res.status(400).send({
          message: "Look`s like something went wrong!",
          error: e.message
        });
      });
    })
    .catch(e => {
      res.status(400).send({
        message: "Look`s like something went wrong!",
        error: e.message
      });
    });
};

exports.stop = (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, {
    $set: {
      stopped: true
    }
  })
    .then(result => {
      res.status(200).send({
        title: "Task Stopped",
        message: "Your task has Stopped!"
      });
    })
    .catch(e => {
      res.status(400).send({
        message: "Look`s like something went wrong!",
        error: e.message
      });
    });
};

exports.finish = (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, {
    $set: {
      stopped: true,
      done: true
    }
  })
    .then(result => {
      res.status(200).send({
        title: "Good Work",
        message: "Your task has ben finished!"
      });
    })
    .catch(e => {
      res.status(400).send({
        message: "Look`s like something went wrong!",
        error: e.message
      });
    });
};

exports.reopen = (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, {
    $set: {
      done: false
    }
  })
    .then(result => {
      res.status(200).send({
        title: "Good luck",
        message: "Your task was opened again!"
      });
    })
    .catch(e => {
      res.status(400).send({
        message: "Look`s like something went wrong!",
        error: e.message
      });
    });
};
