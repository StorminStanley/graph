'use strict';
var _ = require('lodash')
  ;

// Gather list of metrics
// ----------------------

var handlers = {
  rrd: require('./rrdhelpers.js'),
  wsp: require('./wsphelpers.js')
};

function findHandler(channel) {
  return _.find(handlers, function (h) {
    return h.selector(channel);
  });
}

module.exports = {
  find: findHandler
};