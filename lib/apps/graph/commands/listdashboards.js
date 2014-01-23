'use strict';

var _ = require('lodash')
  , socket = require('../socket.js')
  , defaultDashboard = require('./defaultdashboards.json')
  ;

socket.register('listdashboards', function (packet) {
  var self = this;

  if (packet.ref) {
    self.send(packet.ref, self.session.dashboards && _.keys(self.session.dashboards) || [defaultDashboard.name]);
  }
});