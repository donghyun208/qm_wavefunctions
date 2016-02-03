'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:phaseSlider
 * @description
 * # phaseSlider
 */
angular.module('qmWaveApp')
  .directive('phaseSlider', function () {
    return {
      templateUrl: 'views/phaseslider.html',
      restrict: 'E',
      scope: {wave: '='},
      link: function postLink(scope, element, attrs) {
        var wave = scope.wave;
        scope.slider = {
          options: {
            floor: 0,
            ceil: 360,
            translate: function(value) {
              return value + "°";
            }
          }
        };
      }
    };
  });
