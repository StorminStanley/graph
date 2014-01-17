'use strict';

var socket = require('../socket.js');

// Unsubscribe channel
socket.register('unsubscribe', function (packet) {
  socket.unsubscribe(this, packet.message);
});