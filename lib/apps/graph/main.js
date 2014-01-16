'use strict';
var _ = require('lodash')
  , socket = require('./socket.js')
  , handlers = require('./handlers.js')
  ;

// Register the commands
require('./commands/subscribe.js');
require('./commands/unsubscribe.js');
require('./commands/suggest.js');
require('./commands/fetch.js');

// Main loop
// ---------

var mainLoop = function () {
  _(socket.channels).keys().each(function (channel) {
    var handler = handlers.find(channel);
    if (handler) {
      handler.fetchLast(channel, function (err, data) {
        socket.emit(channel, data);
      });
    }
  });
};

// Init
// ----

module.exports = function (websocket) {
  websocket.on('connection', socket.dispatcher);
  
  setInterval(mainLoop, 3000);
};