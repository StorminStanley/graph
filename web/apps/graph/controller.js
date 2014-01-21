'use strict';
(function () {

  angular.module('main')
    .controller('GraphCtrl', ['$scope', 'st2Colors', 'st2GraphGraph', 'st2GraphDashboard',
      function ($scope, colors, Graph, Dashboard) {
        
        var area = {
          type: 'area'
        }, percent = {
          units: 'percent'
        };
        
        $scope.dashboard = new Dashboard($scope);
        
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
      }]);

})();