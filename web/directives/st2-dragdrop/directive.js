'use strict';

angular.module('main')
  .directive('st2Drag', function () {
    
    return {
      restrict: 'C',
      link: function postLink(scope, element, args) {
        args.$set('draggable', true);
        element.on('dragstart', function (e) {
          e.originalEvent.dataTransfer.setData('index', scope.$index);
        });
      }
    };
    
  });

angular.module('main')
  .directive('st2Drop', function () {
    
    return {
      restrict: 'C',
      scope: {
        drop: '&'
      },
      link: function postLink(scope, element, args) {
        element.on('drop', function (e) {
          element.removeClass('st2-drop--over');
          scope.drop({from: e.originalEvent.dataTransfer.getData('index')});
          e.preventDefault();
        });

        element.on('dragover', function (e) {
          element.addClass('st2-drop--over');
          e.preventDefault();
        });
        
        element.on('dragleave', function (e) {
          element.removeClass('st2-drop--over');
          e.preventDefault();
        });
      }
    };
    
  });