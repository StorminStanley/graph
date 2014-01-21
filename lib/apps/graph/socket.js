'use strict';
var _ = require('lodash')
  , Session = require('../../session.js')
  ;

// Prepare Websocket
// -----------------

var channels = {};

var commands = {
  'default': function (packet) {
    console.warn('There is no such command:', packet.channel);
  }
};

var dispatcher = function (conn) {
  conn.session = new Session('some').load();

  // I'm not sure it's a good idea to add a property in object i don't own, but i guess we'll see
  conn.send = function (channel, message) {
    this.write(JSON.stringify({
      channel: channel,
      message: message
    }));
  };

  // For each incoming message, execute command
  conn.on('data', function (container) {
    var packet = JSON.parse(container);
    (commands[packet.channel] || commands['default']).call(this, packet);
  });

  // In case connection has been terminated, unsubscribe it from all channels.
  conn.on('close', function () {
    _.each(conn.channels, function (channel) {
      var index = channel.indexOf(conn);
    
      if (index !== -1) {
        channel.splice(index, 1);
      }
    });
  });
};

// Send message to specific channel
var emit = function (channel, message) {
  _.each(channels[channel], function (conn) {
    conn.send(channel, message);
  });
};

// Register a hook
var register = function (cmd, callback) {
  commands[cmd] = callback;
};

// unregister a hook
var unregister = function (cmd) {
  delete commands[cmd];
};

var subscribe = function (conn, channel) {
  channels[channel] = (channels[channel] || []).concat([conn]);
  conn.channels = (conn.channels || []).concat([channels[channel]]);
};

var unsubscribe = function (conn, channel) {
  if (channels[channel] && channels[channel].length) {
    var index = channels[channel].indexOf(conn);
    
    if (index !== -1) {
      var current = channels[channel].splice(index, 1);
    
      index = conn.channels.indexOf(current);
    
      if (index !== -1) {
        conn.channels.splice(index, 1);
      }
    }
    
    if (!channels[channel].length) {
      delete channels[channel];
    }
  }
};

module.exports = {
  channels: channels,
  dispatcher: dispatcher,
  emit: emit,
  register: register,
  unregister: unregister,
  subscribe: subscribe,
  unsubscribe: unsubscribe
};