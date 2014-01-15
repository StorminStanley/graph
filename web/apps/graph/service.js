'use strict';

angular.module('main')
  .service('st2GraphService', ['$rootScope', '$log', '$q', function ($root, $log, $q) {
    var sock = new SockJS('/graph');
    var channels = {};
    
    // Connect Promise
    // ---------------
    
    // Create a promise to prevent sending message before there is a connection established
    var deferred = $q.defer();
    
    sock.onopen = function () {
      $root.$apply(function () {
        deferred.resolve();
      });
    };
    
    var promise = deferred.promise;
    
    // Message Dispatcher
    // ------------------
    
    // Dispatch an message to a specific listeners
    var dispatcher = function (container) {
      var packet = JSON.parse(container.data);
      
      _.each(channels[packet.channel], function (cb) {
        cb.call(null, null, packet.channel, packet.message);
      });
    };
    
    sock.onmessage = dispatcher;
    
    // Private interfaces
    
    function subscribe(channel, callback) {
      if (!channels[channel] || channels[channel].indexOf(callback) === -1) {
        channels[channel] = (channels[channel] || []).concat([callback]);
        return true;
      } else {
        return false;
      }
    }
    
    function unsubscribe(channel, callback) {
      if (channels[channel] && channels[channel].length) {
        if (callback) {
          var index = channels[channel].indexOf(callback);
          
          if (index !== -1) {
            channels[channel].splice(index, 1);
          }
        } else {
          channels[channel] = [];
        }
      }
    }
    
    // Public Interfaces
    
    // Listen for channel
    this.on = function (channel, callback) {
      var onerror = function (err) {
        if (err) { // not sure about this one
          callback.call(null, new Error(err), channel);
        }
      };
      
      if (subscribe(channel, callback)) {
        this.send('subscribe', channel, onerror);
      }
      
      return this;
    };
    
    // Not listen for channel anymore
    this.off = function (channel, callback) {
      unsubscribe(channel, callback);
      this.send('unsubscribe', channel);
      
      return this;
    };
    
    // Send message to the channel
    this.send = function (channel, message, callback) {
      var packet = {
        channel: channel,
        message: message
      };
      
      // If response needed, create backchannel.
      if (callback) {
        var ref = Math.random(); // Someday we would probably need something more complex
        
        var cb = function (error, channel, message) {
          unsubscribe(ref, cb);
          callback.call(this, error, channel, message);
        };
        
        subscribe(ref, cb);
        
        packet.ref = ref;
      }
      
      promise.then(function () {
        sock.send(JSON.stringify(packet));
      });
      
      return this;
    };
  }]);
