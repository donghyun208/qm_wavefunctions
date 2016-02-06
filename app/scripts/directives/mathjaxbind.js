'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:mathjaxBind
 * @description
 * # mathjaxBind
 */
angular.module('qmWaveApp')
  .directive('mathjaxBind', function () {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                var $script = angular.element("<script type='math/tex'>")
                    .html(value == undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
            });
        }]
    };
});
