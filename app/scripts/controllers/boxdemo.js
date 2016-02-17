'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:BoxDemoCtrl
 * @description
 * # BoxDemoCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('BoxDemoCtrl', ['PartInBox', '$scope', function (PartInBox, $scope) {
    $scope.eigenstates = PartInBox.eigenstates;
    $scope.eigenList = PartInBox.superposition.eigenList;
    $scope.superposition = PartInBox.superposition;
    $scope.modulus = PartInBox.modulus;
    $scope.potential = PartInBox.potential;

  }]);
