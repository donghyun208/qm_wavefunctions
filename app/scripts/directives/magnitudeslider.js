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
      controller: ['$scope', function($scope) {
        $scope.color = '#3f7590'
        $scope.mystyles = "rzslider .rz-pointer { background-color: " + $scope.color + "; }";
        $scope.slider = {
          options: {
            floor: 0,
            ceil: 100,
            step: 1,
            translate: function(value) {
              return value / 100.0;
            },
            onChange: function() {
              $scope.wave.renormalize()
            }
          }
        };
      }],
      link: function(scope, element, attrs) {
        setTimeout(function() {
          var pointer = element[0].getElementsByClassName('rz-pointer')[0]
          pointer.style['background-color'] = "#003A70"
        })


      }
    };
  });
