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
            title: 'us-s04.tir.example.com load',
            yAxis: {
              from: 0
            }
          }, [{
            channel: 'us-s04.tir.example.com/load/load.rrd/shortterm/AVERAGE',
            opts: { color: colors[0] }
          }, {
            channel: 'us-s04.tir.example.com/load/load.rrd/midterm/AVERAGE',
            opts: { color: colors[1] }
          }, {
            channel: 'us-s04.tir.example.com/load/load.rrd/longterm/AVERAGE',
            opts: { color: colors[2] }
          }]);
        
        $scope.dashboard
          .addGraph({
            title: 'us-s05.tir.example.com load',
            yAxis: {
              from: 0,
              to: 0.1
            }
          }, [{
            channel: 'us-s05.tir.example.com/load/load.rrd/shortterm/AVERAGE',
            opts: _.defaults({ color: colors[0] }, percent)
          }, {
            channel: 'us-s05.tir.example.com/load/load.rrd/midterm/AVERAGE',
            opts: _.defaults({ color: colors[1] }, percent)
          }, {
            channel: 'us-s05.tir.example.com/load/load.rrd/longterm/AVERAGE',
            opts: _.defaults({ color: colors[2] }, percent)
          }]);
          
        $scope.dashboard
          .addGraph({
            title: 'us-s06.tir.example.com load',
            yAxis: {
              from: 0
            }
          }, [{
            channel: 'us-s06.tir.example.com/load/load.rrd/shortterm/AVERAGE',
            opts: { color: colors[0] }
          }, {
            channel: 'us-s06.tir.example.com/load/load.rrd/midterm/AVERAGE',
            opts: { color: colors[1] }
          }, {
            channel: 'us-s06.tir.example.com/load/load.rrd/longterm/AVERAGE',
            opts: _.defaults({ color: colors[2] }, area)
          }]);
          
        // $scope.dashboard
        //   .addGraph({
        //     title: 'axs1-cn-1_axcient_inc load',
        //     yAxis: {
        //       from: 0
        //     }
        //   }, [{
        //     channel: 'axs1-cn-1_axcient_inc/load/load/shortterm.wsp/',
        //     opts: { color: colors[0] }
        //   }, {
        //     channel: 'axs1-cn-1_axcient_inc/load/load/midterm.wsp/',
        //     opts: { color: colors[1] }
        //   }, {
        //     channel: 'axs1-cn-1_axcient_inc/load/load/longterm.wsp/',
        //     opts: _.defaults({ color: colors[2] }, area)
        //   }]);
        
        
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