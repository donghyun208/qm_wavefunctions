'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:RingDemoCtrl
 * @description
 * # RingDemoCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('RingDemoCtrl', ['Ring', '$scope', function (Ring, $scope) {
    // $scope.eigenstates = Ring.eigenstates;
    $scope.eigenList = Ring.superposition.eigenList;
    $scope.superposition = Ring.superposition;
    $scope.modulus = Ring.modulus;
    // $scope.potential = Ring.potential;
  }]);
