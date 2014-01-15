'use strict';
var _ = require('lodash')
  , async = require('async')
  , config = require('mech-config')
  , socket = require('./socket.js')
  , handlers = require('./handlers.js')
  ;

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

// Register additional commands

var fs = require("fs");

socket.register('suggest', function (packet) {
  var self = this;
  
  var path = [''].concat(packet.message.split('/').filter(function (e) {
    return e !== '..' && e !== '.' && e !== '';
  }));
  
  async.parallel(path.map(function (e, i, o) {
    var path = o.slice(0, i).concat(e).join('/');
    
    return function (cb) {
      var suggester = handlers.find(path.slice(1).concat('/'));
      
      if (suggester && suggester.suggest) {
        suggester.suggest(path.slice(1).concat('/'), function (e) {
          cb(null, e);
        });
      } else {
        fs.readdir([config.server.collectd.path].concat(path).join('/'), function (err, list) {
          if (err) {
            cb(null, []);
          } else {
            cb(null, _.filter(list, function (e) {
              return e[0] !== '.';
            }));
          }
        });
      }
    };
  }), function (e, d) {
    if (e) {
      self.send(packet.ref, []);
    } else {
      self.send(packet.ref, d || []);
    }
  });
  

  
});

// Init
// ----

module.exports = function (websocket) {
  websocket.on('connection', socket.dispatcher);
  
  setInterval(mainLoop, 3000);
};