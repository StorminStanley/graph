'use strict';
var _ = require('lodash')
  ;

// Gather list of metrics
// ----------------------

var handlers = {
  rrd: require('./helpers/rrd.js'),
  wsp: require('./helpers/wsp.js')
};

function findHandler(channel) {
  return _.find(handlers, function (h) {
    return h.selector(channel);
  });
}

module.exports = {
  find: findHandler
};