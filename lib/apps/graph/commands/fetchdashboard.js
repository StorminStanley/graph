'use strict';

var socket = require('../socket.js')
  , defaultDashboards = require('./defaultdashboards.json')
  ;

socket.register('fetchdashboard', function (packet) {
  var self = this;

  self.send(packet.ref, self.session.dashboards && self.session.dashboards[packet.message] || defaultDashboards);
});