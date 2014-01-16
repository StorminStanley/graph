'use strict';

var socket = require('../socket.js')
  , handlers = require('../handlers.js')
  ;

socket.register('unsubscribe', function (packet) {
  var self = this;
  
  var handler = handlers.find(packet.message.channel);
  if (handler) {
    handler.fetchPeriod(packet.message.channel, {
      from: packet.message.from,
      to: packet.message.to
    }, function (err, data) {
      self.send(packet.ref, data);
    });
  } else {
    self.send(packet.ref, 'There is no handler for that type of metrics');
  }
});