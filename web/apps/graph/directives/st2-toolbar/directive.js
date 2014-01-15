'use strict';

angular.module('main')
  .directive('st2Toolbar', ['st2Units', 'st2Colors', function (units, colors) {
    
    return {
      restrict: 'C',
      scope: {
        spec: '=',
        selected: '='
      },
      templateUrl: 'apps/graph/directives/st2-toolbar/template.html',
      link: function postLink(scope) {
        scope.types = [{
          name: 'area',
          icon: 'st2font-chart-area'
        }, {
          name: 'bar',
          icon: 'st2font-chart-bar'
        }, {
          name: 'line',
          icon: 'st2font-chart-line'
        }, {
          name: 'spot',
          icon: 'st2font-chart-spot'
        }];
        
        scope.units = units;
        
        scope.colors = colors;
        
        scope.toggle = function (layer) {
          scope.show = scope.show && scope.show === layer ? null : layer;
        };
      }
    };
  }]);
