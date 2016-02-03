'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:phasePlot
 * @description
 * # phasePlot
 */
angular.module('qmWaveApp')
  // .directive('phasePlot', ['Timer', 'Plot', function (Timer, Plot) {
  .directive('phasePlot', ['$rootScope', 'Timer', 'Plot', function (rootScope, Timer, Plot) {
    return {
      templateUrl: 'views/phaseplot.html',
      restrict: 'E',
      scope: {wave: '='},
      link: function postLink(scope, element, attrs) {
        var center = 45;
        var radius = 30;
        var wave = scope.wave;
        var svg = element.children()[0]

        makePhaseAxis(svg, center, radius);
        var phaseHand = d3.select(svg).append('line')



        phaseHand.attr('stroke', 'grey')
        phaseHand.attr('x1', center)
        phaseHand.attr('y1', center)
        phaseHand.attr('x2', center)
        phaseHand.attr('y2', center)

        var phaseDot = d3.select(svg).append('circle')
        phaseDot.attr('cx', center)
        phaseDot.attr('cy', center)
        phaseDot.attr('r', 3)
        phaseDot.attr('stroke', 'grey')
        phaseDot.attr('fill', 'orange')

        rootScope.$watchCollection(
          function() { return [wave.re_proj, wave.im_proj] },
          function(nv, ov) {
            phaseHand
            .attr('x2', center - wave.im_proj * radius)
            .attr('y2', center - wave.re_proj * radius)
            phaseDot
            .attr('cx', center - wave.im_proj * radius)
            .attr('cy', center - wave.re_proj * radius)
          })
      }
    };
  }]);

var makePhaseAxis = function(svg, center, radius) {
    var phaseCircle = d3.select(svg).append('circle')
      .attr('stroke', 'grey')
      .attr('fill', 'none')
      .attr('cx', center)
      .attr('cy', center)
      .attr('r',  radius)
    var phaseLine1 = d3.select(svg).append('line')
      .attr('stroke', 'grey')
      .attr('stroke-width', 1)
      .attr('x1', center)
      .attr('x2', center)
      .attr('y1', center - radius)
      .attr('y2', center + radius)
    var phaseLine2 = d3.select(svg).append('line')
      .attr('stroke', 'grey')
      .attr('stroke-width', 1)
      .attr('y1', center)
      .attr('y2', center)
      .attr('x1', center - radius)
      .attr('x2', center + radius)

    var text1 = d3.select(svg).append('text')
      .attr('stroke', 'grey')
      .attr('font', 'Georgia')
      .attr('x', center - 3)
      .attr('y', center - (radius + 5))
      .attr('font-size', 13)
      .text(1)
    var text2 = d3.select(svg).append('text')
      .attr('stroke', 'grey')
      .attr('font', 'Georgia')
      .attr('x', center - 7)
      .attr('y', center + (radius + 12))
      .attr('font-size', 13)
      .text(-1)
    var text3 = d3.select(svg).append('text')
      .attr('stroke', 'grey')
      .attr('font', 'Georgia')
      .attr('x', center + (radius + 4))
      .attr('y', center + 2)
      .attr('font-size', 13)
      .text('i')
    var text4 = d3.select(svg).append('text')
      .attr('stroke', 'grey')
      .attr('font', 'Georgia')
      .attr('x', center - (radius + 12))
      .attr('y', center + 2)
      .attr('font-size', 13)
      .text('-i')
}
