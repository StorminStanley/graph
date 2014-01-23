'use strict';
(function () {

  angular.module('main')
    .controller('GraphCtrl', ['$scope', 'st2Colors', 'st2GraphGraph', 'st2GraphDashboard', 'st2GraphService',
      function ($scope, colors, Graph, Dashboard, graphService) {
        
        var area = {
          type: 'area'
        }, percent = {
          units: 'percent'
        };

        $scope.dashboardid = 'default';
        
        $scope.addGraph = function () {
          $scope.spec = new Graph($scope.dashboard);
          $scope.showOverlay = true;
        };
        
        $scope.removeGraph = function (graph) {
          $scope.dashboard.removeGraph(graph);
          $scope.dashboard.save();
        };
        
        $scope.editGraph = function (graph) {
          $scope.spec = graph.clone();
          $scope.showOverlay = true;
        };

        graphService.send('listdashboards', null, function (err, ref, message) {
          $scope.$apply(function () {
            $scope.listDashboards = message;
          });
        });

        $scope.$watch('dashboardid', function (val) {
          $scope.dashboard && $scope.dashboard.remove();
          $scope.dashboard = new Dashboard($scope, val);
        });

      }]);

})();