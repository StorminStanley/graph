'use strict';

var socket = require('../socket.js');

// Unsubscribe channel
socket.register('unsubscribe', function (packet) {
  var channels = socket.channels;

  if (channels[packet.message] && channels[packet.message].length) {
    var index = channels[packet.message].indexOf(this);
    
    if (index !== -1) {
      var current = channels[packet.message].splice(index, 1);
    
      index = this.channels.indexOf(current);
    
      if (index !== -1) {
        this.channels.splice(index, 1);
      }
    }
    
    if (!channels[packet.message].length) {
      delete channels[packet.message];
    }
  }
});