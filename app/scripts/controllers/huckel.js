'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:HuckelCtrl
 * @description
 * # HuckelCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('HuckelCtrl', ['$scope', function ($scope) {
    $scope.mix_angle = 0;
    $scope.slider = {
      floor: 0,
      ceil: 360
    };
  }]);
