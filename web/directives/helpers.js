/*global angular*/
'use strict';

angular.module('main')
  .filter('toSize', function () {
    return function (bytes, selector) {
      var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      var i = Math.abs(bytes) >= 1 ? parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 10) : 0;
      var value = bytes / Math.pow(1024, i);
      var precision = 3 - value.toString().split('.')[0].length;

      switch (selector) {
      case 'value':
        return value.toFixed(precision < 0 ? 0 : precision);
      case 'multi':
        return sizes[i];
      default:
        return value.toFixed(precision < 0 ? 0 : precision) + ' ' + sizes[i];
      }
    };
  })
  .filter('map', function () {
    return _.map;
  })
  .filter('reduce', function () {
    return _.reduce;
  })
  .filter('sum', function () {
    return function (o) {
      return _.reduce(o, function (a, b) {
        return a + b;
      });
    };
  })
  .filter('property', function () {
    return function (key) {
      return function (object) {
        return key.split('.').reduce(function (o, i) {
          return o[i];
        }, object);
      };
    };
  })
  .filter('status', ['$rootScope', function ($root) {
    return function (value, type) {
      var rules = $root.config.levels
        , rule = type && rules[type] ? rules[type] : rules['default'];
      
      for (var i = 0; i < rule.length; i++) {
        if (rule[i].level <= value) {
          return rule[i];
        }
      }
      
      return {};
    };
  }])
  .filter('capitalize', function () {
    return function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
  })
  .filter('keys', function () {
    return function (data) {
      return _.keys(data);
    };
  })
  .directive('stScope', function () {
    
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, element, attrs) {
        attrs.$observe('stScope', function (attr) {
          scope.$watch(attr, function (obj) {
            _.each(obj, function (v, k) {
              scope[k] = v;
            });
          }, true);
        });
      }
    };
    
  });