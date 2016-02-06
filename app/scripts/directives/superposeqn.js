'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:superposEqn
 * @description
 * # superposEqn
 */
angular.module('qmWaveApp')
  .directive('superposEqn', ['Timer', '$filter', function (Timer, $filter) {
    return {
      templateUrl: 'views/superposeqn.html',
      restrict: 'E',
      scope: {wave: '='},
      link: function postLink(scope, element, attrs) {
        scope.Timer = Timer
        // scope.expression = "\\Psi(x," + $filter('number')(Timer.time, 0) +
        // for (var i=0; i<wave.eigenList.length; i++) {
        //   scope.expression +=
        // }
        scope.tester = "e^{" + scope.wave.eigenList[0].currPhase + "}"
// <span>$ \Psi(x,$</span>
// <span>{{Timer.time| number:0}}</span>
// <span>$) = $</span>
// <span ng-repeat="state in wave.eigenList">
//     <span style="color:#003A70">{{state.mag / 100}}</span>
//     <span>exp(i*</span>
//     <span style="color:#d19000">{{state.currPhase | number:1}}</span>
//     <span>)$\psi_{{state.number}}(x)$ </span>
//     <span>{{$last ? '' : "$+$"}}</span>
      }
    };
  }]);
