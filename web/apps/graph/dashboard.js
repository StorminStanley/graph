'use strict';
(function () {

  angular.module('main')
    .factory('st2GraphDashboard', ['st2GraphGraph',
      function (Graph) {

        function relayEvents(events, from, to) {
          var disregistrators = _.map(events, function (event) {
            return from.$on(event, function () {
              to.$broadcast.apply(to, [event].concat(Array.prototype.slice.call(arguments, 1)));
            });
          });
          
          return _.zipObject(events, disregistrators);
        }

        var Dashboard = function (scope, period) {
          var self = scope.$new();
          
          self.graphs = [];
          self.period = period;
          
          self.addGraph = function (opts, layers) {
            var spec = new Graph(self, opts);
            if (layers) {
              _.each(layers, function (e) {
                spec.addLayer(e.channel, e.opts);
              });
            }
            self.graphs.unshift(spec);
            
            return spec;
          };
          
          self.removeGraph = function (graph) {
            if (self.graphs.indexOf(graph) !== -1) {
              graph.remove();
              self.graphs.splice(self.graphs.indexOf(graph), 1);
              return true;
            }
          };
          
          //var eventsOff =
          relayEvents(['timeframeChanged', 'cursormove'], scope, self);
          
          // Just to be sure i will not forgot that when the time comes.
          // self.remove = function () {
          //   _.each(eventsOff, function (e) {
          //     e();
          //   });
          // }
          
          self.$on('timeframeChanged', function (e, to, from) {
            self.period = to !== "now" && { from: from, to: to };
          });
          
          self.$on('cursormove', function (e, coord) {
            self.cursor = coord;
          });
          
          return self;
        };

        return Dashboard;
      }]);

})();