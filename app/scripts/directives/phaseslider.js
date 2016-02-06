'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:phaseSlider
 * @description
 * # phaseSlider
 */
angular.module('qmWaveApp')
  .directive('phaseSlider', ['$filter', function ($filter) {
    return {
      templateUrl: 'views/phaseslider.html',
      restrict: 'E',
      scope: {wave: '='},
      controller: ['$scope', function($scope){
        $scope.color = '#d19000'
        $scope.mystyles = "rzslider .rz-pointer { background-color: " + $scope.color + "; }";
        $scope.slider = {
          options: {
            floor: 0,
            ceil: 360,
            translate: function(value) {
              return $filter('number')(value / 180, 1) + 'π';
            }
          }
        };
      }],
      link: function(scope, element, attrs) {
        setTimeout(function() {
          var pointer = element[0].getElementsByClassName('rz-pointer')[0]
          pointer.style['background-color'] = "#FFD700"
        })
      }
    };
  }]);
