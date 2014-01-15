'use strict';

angular.module('main')
  .factory('st2GraphGraph', ['st2GraphLayer',
    function (Layer) {
      var Graph = function (scope, options) {
        var self = scope.$new();
        
        self.opts = _.defaults(options || {}, {
          title: null,
          xAxis: true,
          yAxis: true,
          style: null
        });
        self.layers = {};
        
        self.addLayer = function (channel, options) {
          channel = channel.split('/').concat(channel[channel.length - 1] !== '/' ? '' : []).join('/');
          if (!self.layers[channel]) {
            self.layers[channel] = new Layer(self, channel, options);
            self.$$phase || self.$apply();
            return self;
          } else {
            throw new Error('There should be only one layer per channel');
          }
        };
        
        self.removeLayer = function (layer) {
          if (layer.channel) {
            layer = layer.channel;
          }
          
          self.layers[layer].remove();
          
          delete self.layers[layer];
          
          // Not that it's completely necessary to $apply here since layer can only be removed by
          // clicking the button, still i'll leave it for now.
          self.$$phase || self.$apply();
          return self;
        };
        
        self.get = function (time) {
          return _.zipObject(_.keys(self.layers), _.map(self.layers, function (layer) {
            return layer.get(time);
          }));
        };
        
        // Versatile function to produce extrema getters
        function getExtrema(type, extremum) {
          return _(self.layers).filter(function (l) {
            return !l.error;
          }).map(function (l) {
            return l.values.length && (type ?
              _[extremum](l.values, function (e) { return e[type]; })[type] :
              l.values[extremum === 'max' ? l.values.length - 1 : 0][0]);
          })[extremum]().value();
        }
        
        self.getMinTime = _.partial(getExtrema, 0, 'min');
        self.getMaxTime = _.partial(getExtrema, 0, 'max');
        self.getMinValue = _.partial(getExtrema, 1, 'min');
        self.getMaxValue = _.partial(getExtrema, 1, 'max');
        
        self.remove = function () {
          _.each(self.layers, function (e) {
            self.removeLayer(e);
          });
        };
        
        self.clone = function () {
          var clone = new Graph(scope, _.clone(self.opts));
          
          _.each(self.layers, function (e, k) {
            clone.addLayer(k, e.opts);
          });
          
          clone.$proto = self;
          
          return clone;
        };
        
        return self;
      };

      return Graph;
    }]);