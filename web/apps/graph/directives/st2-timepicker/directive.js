'use strict';
/*jshint bitwise: false*/

var formats = [
  [d3.time.format("%Y"), function () { return true; }],
  [d3.time.format("%B"), function (d) { return d.getMonth(); }],
  [d3.time.format("%b %d"), function (d) { return d.getDate() !== 1; }],
  [d3.time.format("%d"), function (d) { return d.getDay() && d.getDate() !== 1; }],
  [d3.time.format("%H:%M"), function (d) { return d.getHours() || d.getMinutes(); }]
];

angular.module('main')
  .value('st2CustomTimeFormat', function (date) {
    var i = formats.length - 1, f = formats[i];
    while (!f[1](date)) {
      f = formats[--i];
    }
    return f[0](date);
  });

angular.module('main')
  .directive('st2Timepicker', [function () {
    
    return {
      restrict: 'C',
      scope: {
        spec: "="
      },
      templateUrl: 'apps/graph/directives/st2-timepicker/template.html',
      link: function postLink(scope) {
        scope.periods = {
          '1H': {
            seconds: 60 * 60,
            tickScale: d3.time.minutes,
            tickInterval: 10
          },
          '1D': {
            seconds: 24 * 60 * 60,
            tickScale: d3.time.hours,
            tickInterval: 3
          },
          '1W': {
            seconds: 7 * 24 * 60 * 60,
            tickScale: d3.time.days,
            tickInterval: 1
          },
          '1M': {
            seconds: 31 * 24 * 60 * 60,
            tickScale: d3.time.days,
            tickInterval: 4
          },
          '6M': {
            seconds: 6 * 31 * 24 * 60 * 60,
            tickScale: d3.time.months,
            tickInterval: 1
          },
          '1Y': {
            seconds: 365 * 24 * 60 * 60,
            tickScale: d3.time.months,
            tickInterval: 2
          },
          '2Y': {
            seconds: 2 * 365 * 24 * 60 * 60,
            tickScale: d3.time.months,
            tickInterval: 3
          }
        };
        
        scope.play = function () {
          scope.periodPicker = null;
          scope.spec.$broadcast('timeframeChanged', 'now');
        };
        
        var broadcast = function (from, to) {
          scope.spec.$broadcast('timeframeChanged', +to / 1000 | 0, +from / 1000 | 0);
        };
        
        scope.$watch('periodPicker', function (key) {
          if (key) {
            // var now = new Date(1387390000000); // For WSP
            var now = new Date(1370640000000); // For RRD
            if (key === 'custom') {
              broadcast(scope.customTimeframe.from * 1000, scope.customTimeframe.to * 1000);
            } else {
              broadcast(now - scope.periods[key].seconds * 1000, now);
            }
          }
        });
        
        scope.$parent.$on('timeframeChanged', function (e, to, from) {
          e.stopPropagation();
          scope.customTimeframe = { from: from, to: to };
          scope.periodPicker = 'custom';
          scope.$$phase || scope.$apply();
        });
      }
    };
  }]);