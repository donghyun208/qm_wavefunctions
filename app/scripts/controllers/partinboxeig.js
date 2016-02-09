'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:PartInBoxEigCtrl
 * @description
 * # PartInBoxEigCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('PartInBoxEigCtrl', ['$scope', 'PartInBox', 'Plot', 'Timer', function ($scope, PartInBox, Plot, Timer) {
    Plot.pitch = 'reset';
    Plot.yaw = 'reset';
    Timer.stop();
    Timer.time = 0;
    $scope.eigenstates = PartInBox.eigenstates;
    $scope.superposition = PartInBox.superposition;
    $scope.modulus = PartInBox.modulus;
    $scope.potential = PartInBox.potential;

  }]);
