'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:perspective
 * @description
 * # perspective
 */
angular.module('qmWaveApp')
  .directive('perspective', ['Plot', function (Plot) {
    return {
      link: function postLink(scope, element, attrs) {
        var startX = 0, startY = 0, x = 0, y = 0;
        element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
          event.preventDefault();
          startX = event.pageX;
          startY = event.pageY;
          element.on('mousemove', mousemove);
          element.on('mouseup', mouseup);
          element.on('mouseleave', mouseup);
        });

        function mousemove(event) {
          y = event.pageY - startY;
          x = event.pageX - startX;
          startX = event.pageX;
          startY = event.pageY;
          scope.$apply(function() {
            Plot.pitch = y / 300;
            Plot.yaw = x / 300;
          })
        }

        function mouseup() {
          element.off('mousemove', mousemove);
          element.off('mouseup', mouseup);
        }
      }
    };
  }]);
