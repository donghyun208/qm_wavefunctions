'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:torusPlot
 * @description
 * # torusPlot
 */
angular.module('qmWaveApp')
  .directive('torusPlot', ['Timer', 'Plot', function (Timer, Plot) {
    return {
      templateUrl: 'views/canvasplot.html',
      restrict: 'E',
      scope: {wave: '=', colorOption: '='},
      link: function postLink(scope, element, attrs) {
        var ctx = element.children()[0].getContext('2d')
        ctx.lineWidth = 2.5;

        var update = function() {
          ctx.clearRect(0, 0, Plot.canvasWidth, Plot.canvasHeight);
          Plot.drawAxisTorus(ctx)

          if (scope.wave.constructor == Array) {
            for (var i=0; i<scope.wave.length; i++) {
              var vectors = scope.wave[i].getVectors();
              Plot.drawWavefcnTorus(ctx, vectors, scope.colorOption)
            }
          }
          else {
            var vectors = scope.wave.getVectors();
            Plot.drawWavefcnTorus(ctx, vectors, scope.colorOption)
          }
        }
        update()

        var watchlist;
        scope.$watchCollection(
          function() {
            watchlist = [Plot.pitch, Plot.yaw, Timer.time];
            if (scope.wave.constructor == Array) {
              for (var i=0; i<scope.wave.length; i++) {
                watchlist.push(scope.wave[i].update)
              }
            }
            else {
              watchlist.push(scope.wave.update)
            }
            return watchlist;
          },
          function(nv, ov) {
            setTimeout(function() {
              update()
            })
          })
      }
    };
  }]);
