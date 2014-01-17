"use strict";
var _ = require('lodash')
  , config = require('mech-config')
  , rewire = require("rewire")
  , hoard = rewire('hoard')
  , timer = require('../timer.js')
  ;

hoard.__set__("unixTime", function () { return timer.getSeconds(); });

// PRIVATE
// -------

// Fetch specific id for its value

var fetch = function (id, to, from) {
  return function (callback) {
    var path = [config.server.collectd.path].concat(id.split('/')).slice(0, -1).join('/')
      , start = (from || to) - 10
      , end = to;

    hoard.fetch(path, start, end, function (err, timeInfo, data) {
      if (err) {
        console.warn('Warning:', err);
        callback(null);
      } else {
        var values = _(data).map(function (e, i) {
          return e && [timeInfo[0] + timeInfo[2] * i, e];
        }).filter(function (e) {
          return e;
        }).value();
        
        if (from && from < timeInfo[0] - timeInfo[2]) {
          values.unshift([timeInfo[0] - timeInfo[2], 0]);
          values.unshift([from, 0]);
        }
        
        callback(null, values);
      }
    });
  };
};

// PUBLIC
// ------

var selector = function (path) {
  return (/.wsp\/$/).test(path);
};

var fetchLast = function (channel, cb) {
  fetch(channel, timer.getSeconds())(cb);
};

var fetchPeriod = function (channel, period, cb) {
  if (!cb) {
    cb = period;
    period = {
      from: timer.getSeconds() - 300,
      to: timer.getSeconds()
    };
  }
  
  if (period.to < period.from) {
    throw new Error('Period\'s From should be less than To');
  }
  
  fetch(channel, period.to, period.from)(cb);
};

module.exports = {
  selector: selector,
  fetchLast: fetchLast,
  fetchPeriod: fetchPeriod
};