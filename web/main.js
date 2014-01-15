'use strict';

/* App Module */
angular.module('main', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/graph', {
        templateUrl: 'apps/graph/template.html',
        controller: 'GraphCtrl',
        name: 'st2-graph',
        title: 'Graph'
      })
      .otherwise({redirectTo: '/graph'});
  }]);

angular.module('main')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', '$http', '$log', '$route',
    function ($s, $root, $loc, $http, $log, $route) {

      $s.route = $route;
      $s.root = $root;

      $root.Math = Math;

      $s.$on("$routeChangeStart", function (event, next) {
        if (next.$$route) {
          window.name = next.$$route.name;
        }
      });

      $log.time("Loading Config data.");
      $http.get("/config")
        .success(function (res) {
          $root.config = res;
          $log.time("Config data has been loaded.");
        }).error(function () {
          $root.config = {};
          $log.time("Config data has been failed.");
        });
      
      $(window).resize(function () {
        $root.$broadcast('resize');
      });
    }
  ]);
