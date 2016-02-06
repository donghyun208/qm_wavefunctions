'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:TimeEvolveCtrl
 * @description
 * # TimeEvolveCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('TimeEvolveCtrl', ['PartInBox', 'Timer', '$scope', function (PartInBox, Timer, $scope) {
    $scope.eigenstates = PartInBox.eigenstates;
    $scope.eigenList = PartInBox.superposition.eigenList;
    $scope.superposition = PartInBox.superposition;
    $scope.modulus = PartInBox.modulus;
    $scope.Timer = Timer;
    $scope.showResetButton = false;
    $scope.buttonText = "Start Time Evolution";

    $scope.timeButton = function() {
      var toggleState = Timer.toggle()
      $scope.showResetButton = true;
      if (toggleState) {
        $scope.buttonText = "Resume Time"
      }
      else {
        $scope.buttonText = "Pause Time"
      }
    }

    $scope.resetButton = function() {
      Timer.time = 0;
    }
  }]);
