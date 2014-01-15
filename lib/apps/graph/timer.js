"use strict";

var config = require('mech-config');

// Timer
// -----

// Temporary construction to be able to work with offline data (files, that has no updates in a near past)
var Timer = function (initial) {
  var offset = Date.now() - initial;
  
  return {
    now: function () {
      return Date.now() - offset;
    },
    getSeconds: function () {
      return Math.floor(this.now() / 1000);
    }
  };
};

module.exports = new Timer(config.server.collectd.time);
