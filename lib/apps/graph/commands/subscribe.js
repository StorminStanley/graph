'use strict';
var socket = require('../socket.js')
  , handlers = require('../handlers.js')
  ;

// Subscribe connection for channel updates
socket.register('subscribe', function (packet) {
  var self = this;

  socket.subscribe(self, packet.message);

  // Feed connection with the channel data from the near past
  var handler = handlers.find(packet.message);
  if (handler) {
    handler.fetchPeriod(packet.message, function (err, data) {
      self.send(packet.message, data);
    });
  } else {
    self.send(packet.ref, 'There is no handler for that type of metrics');
  }
});