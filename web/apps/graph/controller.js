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
        
        $scope.dashboard
          .addGraph({
            title: 'localhost memory'
          }, [{
            channel: 'localhost/memory/memory-active.rrd/value/AVERAGE/',
            opts: {
              color: colors[0],
              units: 'bytes',
              title: 'active'
            }
          }, {
            channel: 'localhost/memory/memory-inactive.rrd/value/AVERAGE/',
            opts: {
              color: colors[1],
              units: 'bytes',
              title: 'inactive'
            }
          }, {
            channel: 'localhost/memory/memory-wired.rrd/value/AVERAGE/',
            opts: {
              color: colors[2],
              units: 'bytes',
              title: 'wired'
            }
          }, {
            channel: 'localhost/memory/memory-free.rrd/value/AVERAGE/',
            opts: {
              color: colors[3],
              units: 'bytes',
              title: 'free'
            }
          }]);
        
        $scope.dashboard
          .addGraph({
            title: 'localhost load'
          }, [{
            channel: 'localhost/load/load.rrd/shortterm/AVERAGE/',
            opts: {
              color: colors[0],
              title: 'shortterm'
            }
          }, {
            channel: 'localhost/load/load.rrd/midterm/AVERAGE/',
            opts: {
              color: colors[1],
              title: 'midterm'
            }
          }, {
            channel: 'localhost/load/load.rrd/longterm/AVERAGE/',
            opts: {
              color: colors[2],
              title: 'longterm'
            }
          }]);

        $scope.addGraph = function () {
          $scope.spec = new Graph($scope.dashboard);
          $scope.showOverlay = true;
        };
        
        $scope.removeGraph = function (graph) {
          $scope.dashboard.removeGraph(graph);
        };
        
        $scope.editGraph = function (graph) {
          $scope.spec = graph.clone();
          $scope.showOverlay = true;
        };
      }]);

})();