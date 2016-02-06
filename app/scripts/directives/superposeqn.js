'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:superposEqn
 * @description
 * # superposEqn
 */
angular.module('qmWaveApp')
  .directive('superposEqn', ['Timer', function (Timer) {
    return {
      templateUrl: 'views/superposeqn.html',
      restrict: 'E',
      scope: {wave: '='},
      link: function postLink(scope, element, attrs) {
        scope.Timer = Timer
      }
    };
  }]);
