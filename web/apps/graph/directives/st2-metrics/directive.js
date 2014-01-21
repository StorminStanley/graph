'use strict';
(function () {

  angular.module('main')
    .directive('st2Metrics__searchField', function () {
      return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
          ctrl.$parsers.unshift(function (viewValue) {
            if (_.find(viewValue, function (e) {
              return e === '..' && e === '.';
            })) {
              // it is invalid, return undefined (no model update)
              ctrl.$setValidity('path', false);
              return undefined;
            } else {
              // it is valid
              ctrl.$setValidity('path', true);
              return viewValue;
            }
          });
        }
      };
    });

  angular.module('main')
    .directive('st2Metrics', ['st2GraphService', function (graphService) {
      
      return {
        restrict: 'C',
        scope: {
          spec: '=',
          dashboard: '=',
          selected: '='
        },
        templateUrl: 'apps/graph/directives/st2-metrics/template.html',
        link: function postLink(scope, element) {
          scope.search = '';
          scope.path = '';
          scope.lastToken = '';
          scope.results = [];
          
          scope.browser = [];
          
          scope.$watch('search', function () {
            var tokens = (scope.search || '').split('/');
            scope.lastToken = tokens.pop();
            tokens = tokens.join('/');
            if (tokens !== scope.path) {
              scope.path = tokens;
            }
          });
          
          scope.$watch('path', function () {
            graphService.send('suggest', scope.path, function (error, channel, message) {
              scope.$apply(function () {
                scope.results = message[message.length - 1];
              
                scope.browser = _.map(message, function (e, i) {
                  return {
                    path: scope.path.split('/').slice(0, i).join('/'),
                    files: e
                  };
                });
              });
            });
          });
          
          scope.$watch('selected', function () {
            scope.search = scope.selected ? scope.selected.channel : '';
          });
          
          scope.submit = function (search) {
            if (scope.selected) {
              var channel = scope.search
                , opts = scope.selected.opts;
              scope.spec.removeLayer(scope.selected);
              scope.spec.addLayer(channel, opts);
              scope.selected = undefined;
            } else {
              scope.spec.addLayer(search);
            }
            
            // scope.search = '';
            scope.name = '';
          };
          
          scope.back = function () {
            scope.spec.$parent.$parent.showOverlay = false;
            _.each(scope.spec.layers, function (e) {
              e.unsubscribe();
            });
            
            // TODO: check if changes were actually made
            if (window.confirm('Do you want to save the changes?')) {
              scope.dashboard.removeGraph(scope.spec.$proto);
              delete scope.spec.$proto;
              scope.dashboard.addGraph(scope.spec.opts, scope.spec.layers);
              scope.dashboard.save();
            }
            
            delete scope.spec.$proto;
            
          };
          
          var input = element.find('.st2-metrics__search-field');
          
          element.on("keydown", ".st2-metrics__suggest-item", function (e) {
            var self = this;
            
            function tab() {
              (e.shiftKey ? prev : next).apply(self, arguments);
            }
            
            function down() {
              (e.shiftKey ? last : next).apply(self, arguments);
            }
            
            function up() {
              (e.shiftKey ? first : prev).apply(self, arguments);
            }
            
            function back() {
              var pathArray = scope.path.split('/');
              pathArray.pop();
              input.val(pathArray.concat('').join('/')).trigger('input').focus();
            }
                      
            function next() {
              angular.element(self).next().focus();
            }
            
            function prev() {
              var target = angular.element(self).prev();
              (target.length ? target : input).focus();
            }
            
            function enter() {
              input.val((scope.path ? [scope.path] : []).concat([angular.element(self).scope().token, '']).join('/')).trigger('input').focus();
            }
            
            function first() {
              angular.element(self).siblings().first().focus();
            }
            
            function last() {
              angular.element(self).siblings().last().focus();
            }
            
            function defaultOption() {
              console.log(e.keyCode);
            }
            
            var konami = {
              9: tab,     // Tab
              8: back,    // Backspace
              37: back,   // Left
              40: down,   // Down
              38: up,     // Up
              39: enter,  // Right
              13: enter,  // Enter
              36: first,  // Home
              35: last    // End
            };
            
            if (konami[e.keyCode]) {
              e.preventDefault();
            }
            
            (konami[e.keyCode] || defaultOption).apply(self, arguments);
          });
          
          element.on("click", ".st2-metrics__suggest-item", function () {
            input.val((scope.path ? [scope.path] : []).concat([angular.element(this).scope().token, '']).join('/')).trigger('input').focus();
          });
          
          element.on("click", ".st2-metrics__browser-item", function () {
            var path = angular.element(this).scope().$parent.column.path;
            input.val((path ? [path] : []).concat([angular.element(this).scope().item, '']).join('/')).trigger('input').focus();
          });
          
          scope.$watch('toggle', function () {
            scope.$root.$broadcast('resize');
          });
        }
      };
    }]);

})();