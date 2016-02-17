'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('DemoCtrl', ['Timer', '$scope', '$state', function (Timer, $scope, $state) {
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
    $scope.active = function(route) {
    return $state.is(route);
    };

    $scope.tabs = [
        { heading: "Particle in a Box", route:"demo.box", active:false }, // Tab 1
        { heading: "Harmonic Oscillator", route:"demo.ho", active:false }, // Tab 2
        { heading: "Particle in a Ring", route:"demo.ring", active:false }, // Tab 3
    ];

    $scope.$on("$stateChangeSuccess", function() { // Keep the right tab highlighted if the URL changes.
        $scope.tabs.forEach(function(tab) {
            tab.active = $scope.active(tab.route);
        });
    });
  }]);
