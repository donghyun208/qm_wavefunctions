'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:HODemoCtrl
 * @description
 * # HODemoCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('HODemoCtrl', ['HO', 'Timer', '$scope', function (HO, Timer, $scope) {
    $scope.eigenstates = HO.eigenstates;
    $scope.eigenList = HO.superposition.eigenList;
    $scope.superposition = HO.superposition;
    $scope.modulus = HO.modulus;
    $scope.potential = HO.potential;

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
