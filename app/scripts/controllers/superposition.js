'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:SuperpositionCtrl
 * @description
 * # SuperpositionCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('SuperpositionCtrl', ['PartInBox', 'Timer', '$scope', function (PartInBox, Timer, $scope) {
    Timer.time = 0;
    $scope.eigenList = PartInBox.superposition.eigenList;
    $scope.superposition = PartInBox.superposition;
    $scope.modulus = PartInBox.modulus;

  }]);
