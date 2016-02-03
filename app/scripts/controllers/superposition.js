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
    $scope.eigenstates = PartInBox.superposition.eigenList;
    $scope.superposition = PartInBox.superposition;
    $scope.modulus = PartInBox.modulus;

    $scope.buttonText = "Start Time Evolution";

    $scope.timeButton = function() {
      var toggleState = Timer.toggle()
      if (toggleState) {
        $scope.buttonText = "Resume Time"
      }
      else {
        $scope.buttonText = "Pause Time"
      }
    }
  }]);
