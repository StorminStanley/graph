"use strict";

// Timer
// -----

// Temporary construction to be able to work with offline data (files, that has no updates in a near past)
var Timer = function () {
  return {
    now: function () {
      return new Date() - 10000; // substracting 10 seconds to compensate the lag created by rrd resolution
    },
    getSeconds: function () {
      return Math.floor(this.now() / 1000);
    }
  };
};

module.exports = new Timer();
