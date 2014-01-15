'use strict';

angular.module('main')
  .directive('st2Menu', ['$route', '$location', function ($route, $location) {
    
    return {
      restrict: 'C',
      scope: true,
      replace: true,
      templateUrl: 'directives/st2-menu/template.html',
      link: function postLink(scope) {
        scope.routes = Object.keys($route.routes).filter(function (e) {
          return $route.routes[e].name && !$route.routes[e].disabled;
        }).map(function (e) {
          return angular.extend($route.routes[e], { href: e });
        });
        
        scope.isActiveLocation = function (route) {
          return route === $location.path();
        };
      }
    };
  }]);
