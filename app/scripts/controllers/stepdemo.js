'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:StepDemoCtrl
 * @description
 * # StepDemoCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('StepDemoCtrl', ['PartStep', '$scope', function (PartStep, $scope) {
    $scope.eigenstates = PartStep.eigenstates;
    $scope.eigenList = PartStep.superposition.eigenList;
    $scope.superposition = PartStep.superposition;
    $scope.modulus = PartStep.modulus;
    $scope.potential = PartStep.potential;

  }]);
