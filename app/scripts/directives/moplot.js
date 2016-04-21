'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:moplot
 * @description
 * # moplot
 */
angular.module('qmWaveApp')
  // .directive('moPlot', ['d3', function(d3Service) {
  .directive('moPlot', [function() {
    return {
      restrict: 'EA',
      scope: {eig: '=',
              angle: '='},
      link: function(scope, element, attrs) {
        // d3Service.d3().then(function(d3) {
        if (1) {
          var margin = parseInt(attrs.margin) || 20,
              plotHeight = parseInt(attrs.plotHeight) || 20,
              plotWidth = parseInt(attrs.plotWidth) || 20;
          var svg = d3.select(element[0])
            .append('svg')
            // .style('width', '100%')
            .attr('width', plotWidth)
            .attr('height', plotHeight);

          // Browser onresize event
          // window.onresize = function() {
          //   scope.$apply();
          // };

          // hard-code data

          // returns the proper x,y coordinate for all circles:
          // function pos(data)

          // Watch for resize event

          var self = scope
          var firsttime = 1
          scope.$watch(function() {
            return self.angle
          }, function(nv) {
            if (!firsttime) {
              scope.rerender(self.eig, nv);
            }
            firsttime = 0
          });

          // scope.$watch(function() {
          //   return angular.element(window)[0].innerWidth;
          // }, function() {
          //   scope.render(scope.data);
          // });


          var hex_coords = [[ 0.0,       1.0],
                            [ 0.866025,  0.5],
                            [ 0.866025, -0.5],
                            [ 0.0,      -1.0],
                            [-0.866025, -0.5],
                            [-0.866025,  0.5]];
          var hex_radius = 20;

          var degeneracy_offset = 60;
          var a0_radius = 18;

          var molecular_orbital;
          var color = d3.scale.category20();

          var energyScale = d3.scale.linear()
                            .domain([2,-2])
                            .range([50, 250]);
          var axisLabel = {"0": "\u03B1",
                         "-1": "\u03B1 + \u03B2",
                         "-2": "\u03B1 + 2\u03B2",
                         "1": "\u03B1 - \u03B2",
                         "2": "\u03B1 - 2\u03B2" };

          var subscripts = '₁₂₃₄₅₆';

          scope.rerender = function(data, mix_angle) {

            svg.selectAll('g.moGroup')
              .each(function(mo, index) {
                if (mo.degen !== 0) {
                  var molecular_orbital = d3.select(this)
                  molecular_orbital
                  .selectAll('circle')
                  .data(data[index].vec)
                  .attr('r', function(coef) { return Math.abs(coef) * a0_radius}) // use abs instead of pow so that the circle area corresponds to magnitude instead of circle radius
                  .attr('fill', function(coef) { return color(Math.sign(coef)); })

                  molecular_orbital
                  .selectAll('line.nodalPlane')
                  .data(data[index].nodes)
                  .attr('x1', function(angle, index) {return  angle_to_line_segment(angle)[0] * (hex_radius * 1.3)})
                  .attr('y1', function(angle, index) {return  angle_to_line_segment(angle)[1] * (hex_radius * 1.3)})
                  .attr('x2', function(angle, index) {return -angle_to_line_segment(angle)[0] * (hex_radius * 1.3)})
                  .attr('y2', function(angle, index) {return -angle_to_line_segment(angle)[1] * (hex_radius * 1.3)})
                }
              });
          }

          scope.render = function(data) {
            var yAxis = d3.svg.axis()
                  .scale(energyScale)
                  .orient("left")
                  .ticks(5)
                  .tickFormat(function(d) {
                    return axisLabel[d];
                  })
            svg.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(" + 50 + ",0)")
              .call(yAxis)

            svg.append("g")
              .selectAll('g')
              .data(data).enter()
              .append('g')
              .attr('class', 'moGroup')
              .each(function(mo, index) {
                molecular_orbital = d3.select(this);

                // NODE lines
                molecular_orbital
                .selectAll('line')
                .data(mo.nodes).enter()
                .append('line')
                .attr('class', 'nodalPlane')
                .attr('x1', function(angle, index) {return  angle_to_line_segment(angle)[0] * (hex_radius * 1.3)})
                .attr('y1', function(angle, index) {return  angle_to_line_segment(angle)[1] * (hex_radius * 1.3)})
                .attr('x2', function(angle, index) {return -angle_to_line_segment(angle)[0] * (hex_radius * 1.3)})
                .attr('y2', function(angle, index) {return -angle_to_line_segment(angle)[1] * (hex_radius * 1.3)})
                .attr('stroke', "red")
                .style("stroke-dasharray", ("3, 3"))
                .style("stroke-opacity", 0.7)
                .attr('stroke-width', 0)
                .transition()
                .duration(2000)
                .attr('stroke-width', 1.5)

                // LOBE circles
                molecular_orbital
                .selectAll('circle')
                .data(mo.vec).enter()
                .append('circle')
                .attr('cx', function(coef, index) {
                  return hex_coords[index][0] * hex_radius;
                })
                .attr('cy', function(coef, index) {
                  return hex_coords[index][1] * hex_radius;
                })
                .attr('fill', function(coef) { return color(Math.sign(coef)); })
                .attr('r', 0)
                .transition()
                .duration(2000)
                .attr('r', function(coef) { return Math.abs(coef) * a0_radius}) // use abs instead of pow so that the circle area corresponds to magnitude instead of circle radius

                molecular_orbital.append('text')
                .attr("width",100)
                .attr("height",100)
                // text.text("$$\\psi_" + (index + 1)+ "$$")
                .text("\u03C8" + subscripts[index])
                .attr('x', '25')
                .attr('y', '-12')


                // HEX lines
                molecular_orbital
                .append('g')
                .selectAll('line')
                .data(hex_coords).enter()
                .append('line')
                .attr('x1', function(point, index) {
                  return point[0] * hex_radius;
                })
                .attr('y1', function(point, index) {
                  return point[1] * hex_radius;
                })
                .attr('x2', function(point, index) {
                  return hex_coords[(index + 1) % 6][0] * hex_radius;
                })
                .attr('y2', function(point, index) {
                  return hex_coords[(index + 1) % 6][1] * hex_radius;
                })
                .attr('stroke', "gray")
                .attr('stroke-width', 0)
                .transition()
                .duration(2000)
                .attr('stroke-width', 1)
              })
              .attr("transform", function(mo, index) {
                  var x = 160;
                  if (mo.degen !== 0) {
                    x += mo.degen * degeneracy_offset;
                  }
                  var y = energyScale(mo.energy);
                return "translate(" + x + ',' + y + ")"; })
          };

          scope.render(scope.eig)
        };
      }
    }
}]);

function angle_to_line_segment(angle) {
  var x = Math.cos(angle / 360.0 * 2 * Math.PI)
  var y = Math.sin(angle / 360.0 * 2 * Math.PI)
  return [x, y]
}

function rot_mat(angle) {
  angle = angle / 360.0 * 2 * Math.PI
  return [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]]
}
