'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('MainCtrl', ['$scope', 'Timer', function ($scope, Timer) {

    Timer.start();
    $scope.Timer = Timer;
  }]);
