'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:HeadercontrollerCtrl
 * @description
 * # HeadercontrollerCtrl
 * Controller of the qmWaveApp
 http://stackoverflow.com/a/18562339/1276363
 */
angular.module('qmWaveApp')
  .controller('HeaderCtrl', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) >= 0
    };
  });
