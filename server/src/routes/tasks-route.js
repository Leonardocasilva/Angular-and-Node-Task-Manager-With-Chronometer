"use strict";

const express = require("express");
const router = express.Router();
const controller = require('../controller/task-controller');

router.get('/', controller.gets);
router.post('/', controller.post);
router.put('/:id', controller.put);

router.get('/find/:id', controller.get);
router.put('/time/:id', controller.time);
router.put('/start/:id', controller.start);
router.put('/stop/:id', controller.stop);
router.put('/finish/:id', controller.finish);
router.put('/reopen/:id', controller.reopen);

module.exports = router;
