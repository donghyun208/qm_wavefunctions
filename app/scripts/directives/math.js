'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:math
 * @description
 * # math
 */
angular.module('qmWaveApp')
  .directive('math', function () {
    return {
        restrict: "EA",
        link: function postLink(scope, element, attrs) {
            setTimeout(function() {
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            });
        }
    };
});

