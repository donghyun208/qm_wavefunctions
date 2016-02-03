'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:magnitudeSlider
 * @description
 * # magnitudeSlider
 */
angular.module('qmWaveApp')
  .directive('magnitudeSlider', function () {
    return {
      templateUrl: 'views/magnitudeslider.html',
      restrict: 'E',
      scope: {wave: '=', normalize:'='},
      link: function postLink(scope, element, attrs) {
        var wave = scope.wave;
        scope.slider = {
          options: {
            floor: 0,
            ceil: 100,
            step: 1,
            translate: function(value) {
              return value / 100.0;
            },
            onChange: function() {
              scope.wave.renormalize()
            }
          }
        };
      }
    };
  });
