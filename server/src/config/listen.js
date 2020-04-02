const { performance } = require("perf_hooks");
const EventEmitter = require("events").EventEmitter;
const request = require("request");

request.defaults({
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});

const emitter = new EventEmitter();
const url = "http://localhost:3000/tasks/";
let seconds = 0;
let minutes = 0;
let hours = 0;
let init;
let ret = [];

emitter.on("init", args => {
  request(url, (er, res, body) => {
    ret = JSON.parse(body);

    for (let i = 0; i < ret.length; i++) {
      if (ret[i].stopped === false && ret[i].new === false) {
        seconds = parseFloat(ret[i].seconds) + 1;
        minutes = parseFloat(ret[i].minutes) + 1;
        hours = parseFloat(ret[i].hours) + 1;

        ret[i].seconds =
          seconds.toString().length === 1
            ? "0" + seconds.toString()
            : seconds.toString();

        if (ret[i].seconds === "60") {
          ret[i].seconds = "00";
          ret[i].minutes =
            minutes.toString().length === 1
              ? "0" + minutes.toString()
              : minutes.toString();
        }

        if (ret[i].minutes === "60") {
          ret[i].minutes = "00";
          ret[i].hours =
            hours.toString().length === 1
              ? "0" + hours.toString()
              : hours.toString();
        }

        request({
          url: `${url}/time/${ret[i]._id}`,
          method: 'PUT',
          json: {
            "hours": ret[i].hours,
            "minutes": ret[i].minutes,
            "seconds": ret[i].seconds,
            "new": false,
            "stopped": false,
            "done": false,
            "_id": ret[i]._id,
            "name": ret[i].name
          },
        });
      }
    }
  });


});

exports.emitter = emitter;
