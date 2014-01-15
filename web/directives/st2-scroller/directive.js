'use strict';

angular.module('main')
  .directive('st2Scroller', function () {
    
    return {
      restrict: 'C',
      scope: true,
      transclude: true,
      templateUrl: '/directives/st2-scroller/template.html',
      link: function postLink(scope, element) {
        scope.top = function (to) {
          element.scrollTop(to);
        };
      }
    };
    
  });
