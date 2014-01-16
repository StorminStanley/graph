'use strict';
/*jshint bitwise:false*/
(function () {

  angular.module('main')
    .factory('st2GraphLayer', ['st2GraphService', '$q',
      function (graphService, $q) {
        var Layer = function (scope, channel, options) {
          var self = scope.$new();
          
          var DEFAULT_TIMEFRAME = 300;
          
          var deferred;
          
          var subscribed;
              
          self.opts = _.defaults(_.clone(options) || {}, {
            title: null,
            units: 'decimal',
            type: 'line'
          });
          
          self.channel = channel;
          self.values = [];
          
          function observer(err, channel, data) { // 'channel' attribute looks obsolete
            if (err) {
              self.error = err;
            } else {
              if (!data) {
                self.error = "No data";
              } else if (!self.values.length || (data && data[0] && _.last(self.values)[0] !== data[0][0])) {
                
                // clear all the data points we got in a latest update
                self.values = self.values.slice(0, _(self.values).findLastIndex(function (e) {
                  return e[0] < data[0][0];
                }) + 1);
                
                // merge data points
                self.values = self.values.concat(data);
                
                // strip excessive data points
                self.values = self.values.slice(_(self.values).findIndex(function (e, i, o) {
                  return e[0] >= o[o.length - 1][0] - DEFAULT_TIMEFRAME;
                }));
                
                self.$$phase || self.$apply();
              }
            }
          }
          
          self.subscribe = function () {
            subscribed = true;
            graphService.on(channel, observer);
            return self;
          };
          
          self.unsubscribe = function () {
            subscribed = false;
            graphService.off(channel, observer);
            return self;
          };
          
          self.fetch = function (from, to, cb) {
            graphService.send('fetch', {
              channel: self.channel,
              from: from,
              to: to
            }, cb);
          };
          
          self.remove = function () {
            self.values = [];
            self.unsubscribe();
            return self;
          };
          
          self.findClosest = function (time) {
            var arr = self.values, beginning = 0, end = arr.length, target;
            if (!end) {
              return undefined;
            }
            while (true) {
              target = ((beginning + end) >> 1);
              if ((target === end || target === beginning) && arr[target][0] !== time) {
                return arr[target + 1] && (time - arr[target][0]) > (arr[target + 1][0] - time) ? arr[target + 1] : arr[target];
              }
              if (arr[target][0] > time) {
                end = target;
              } else if (arr[target][0] < time) {
                beginning = target;
              } else {
                return arr[target];
              }
            }
          };
          
          self.get = function (time) {
            var res = self.findClosest(time);
            return res ? res[1] : deferred && deferred.promise;
          };
          
          self.$parent.$parent.$watch('period', function (period) {
            if (!period) {
              self.values = [];
              subscribed && self.unsubscribe();
              self.subscribe();
            } else {
              self.values = [];
              self.unsubscribe();
              deferred = $q.defer();
              self.fetch(period.from, period.to, function (err, ref, data) {
                self.values = data;
                self.$apply(function () {
                  deferred.resolve();
                  deferred = null;
                });
              });
            }
            
            self.$$phase || self.$apply();
          });
          
          return self;
        };

        return Layer;
      }]);

})();