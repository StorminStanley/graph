'use strict';

var socket = require('../socket.js')
  ;

socket.register('fetchdashboard', function (packet) {
  var self = this;

  self.send(packet.ref, self.session.dashboard);
});