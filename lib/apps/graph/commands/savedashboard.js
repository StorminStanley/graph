'use strict';

var socket = require('../socket.js')
  ;

socket.register('savedashboard', function (packet) {
  var self = this;

  self.session.dashboards = self.session.dashboards || {};

  self.session.dashboards[packet.message.name] = packet.message;
  self.session.save();

  if (packet.ref) {
    self.send(packet.ref, self.session);
  }
});