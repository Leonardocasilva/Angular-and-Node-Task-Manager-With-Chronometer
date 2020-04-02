"use strict";

const mongoose = require("mongoose");
const Task = mongoose.model("Task");

const repository = require('../repository/task-repository');


exports.gets = async (req, res, next) => {
  try {
    const data = await repository.gets();
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send({
      title: 'Ops',
      message: 'Something went wrong!'
    });
  }
};

exports.get = (req, res, next) => {
  repository
    .get(req.params.id)
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

exports.post = (req, res, next) => {
  repository
    .post(req.body)
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
  repository
    .put(req.body, req.params.id)
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

exports.time = async (req, res, next) => {
  try {
    const data = await repository.time(req.body, req.params.id);
    return res.status(200).send(data);
  } catch (e) {
    res.status(400).send({
      title: 'Ops',
      message: 'Something went wrong!'
    });
  }
};

exports.start = async (req, res, next) => {
  try {
    const data = await repository.start(req.params.id);
    return res.status(200).send(data);
  } catch (e) {
    res.status(400).send({
      title: 'Ops',
      message: 'Something went wrong!'
    });
  }
};

exports.stop = async (req, res, next) => {
  try {
    const data = await repository.stop(req.params.id);
    return res.status(200).send(data);
  } catch (e) {
    res.status(400).send({
      title: 'Ops',
      message: 'Something went wrong!'
    });
  }
};

exports.finish = (req, res, next) => {
  repository
    .finish(req.params.id)
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
  repository
    .reopen(req.params.id)
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
