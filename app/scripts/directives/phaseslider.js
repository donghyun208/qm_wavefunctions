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
      controller: ['$scope', function($scope){
        $scope.slider = {
          options: {
            floor: 0,
            ceil: 360,
            translate: function(value) {
              return value + "°";
            }
          }
        };
      }]
    };
  });
