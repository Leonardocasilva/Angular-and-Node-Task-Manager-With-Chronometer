"use strict";

const mongoose = require("mongoose");
const Task = mongoose.model("Task");

exports.gets = async () => {
  const res = await Task.find({});
  return res;
};

exports.get = (id) => {
  return Task.find({
    _id: id
  });
};

exports.post = (req) => {
  var task = new Task();

  task.name = req.name;
  task.seconds = req.seconds;
  task.minutes = req.minutes;
  task.hour = req.hour;

  return task.save();
};

exports.put = (req, id) => {
  return Task.findByIdAndUpdate(id, {
    $set: {
      name: req.name
    }
  });
};

exports.time = async (req, id) => {
  const res = await Task.findByIdAndUpdate(id, {
    $set: {
      hours: req.hours,
      minutes: req.minutes,
      seconds: req.seconds
    }
  });

  return res;
};

exports.start = async (id) => {
  const res = await Task.findByIdAndUpdate(id, {
    $set: {
      new: false,
      stopped: false
    }
  });

  return res;
};

exports.stop = async (id) => {
  const res = await Task.findByIdAndUpdate(id, {
    $set: {
      stopped: true
    }
  });

  return res;
};

exports.finish = (id) => {
  return Task.findByIdAndUpdate(id, {
    $set: {
      stopped: true,
      done: true
    }
  });
};

exports.reopen = (id) => {
  return Task.findByIdAndUpdate(id, {
    $set: {
      done: false
    }
  });
};
