'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:PartInBoxEigCtrl
 * @description
 * # PartInBoxEigCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('PartInBoxEigCtrl', ['$scope', 'PartInBox', 'Plot', function ($scope, PartInBox, Plot) {
    Plot.pitch = 0
    Plot.yaw = 0
    $scope.eigenstates = PartInBox.eigenstates;
    $scope.superposition = PartInBox.superposition;
    $scope.modulus = PartInBox.modulus;

    setTimeout(function() {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    });
  }]);
