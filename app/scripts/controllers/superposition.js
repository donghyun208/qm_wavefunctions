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
    Timer.stop();
    Timer.time = 0;
    $scope.eigenList = PartInBox.superposition2.eigenList;
    $scope.superposition = PartInBox.superposition2;
    $scope.modulus = PartInBox.modulus2;
    $scope.potential = PartInBox.potential;

  }]);
