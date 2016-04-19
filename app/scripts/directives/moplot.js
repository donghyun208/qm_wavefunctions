'use strict';

/**
 * @ngdoc directive
 * @name qmWaveApp.directive:moplot
 * @description
 * # moplot
 */
angular.module('qmWaveApp')
  .directive('moPlot', ['d3', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {angle: '='},
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
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
          scope.data = [
            {energy: -2, degen:  0, vec: [ 0.40824829,  0.40824829,  0.40824829,  0.40824829,  0.40824829,  0.40824829]},
            {energy: -1, degen: -1, vec: [-0.57735027, -0.28867513,  0.28867513,  0.57735027,  0.28867513, -0.28867513]},
            {energy: -1, degen:  1, vec: [ 0.0,         0.5,         0.5,         0.0,        -0.5,        -0.5       ]},
            {energy:  1, degen: -1, vec: [ 0.57735027, -0.28867513, -0.28867513,  0.57735027, -0.28867513, -0.28867513]},
            {energy:  1, degen:  1, vec: [ 0.0,        -0.5,         0.5,         0.0,        -0.5,         0.5       ]},
            {energy:  2, degen:  0, vec: [ 0.40824829, -0.40824829,  0.40824829, -0.40824829,  0.40824829, -0.40824829]}
          ];

          // returns the proper x,y coordinate for all circles:
          // function pos(data)

          // Watch for resize event

          var self = scope
          var firsttime = 1
          scope.$watch(function() {
            return self.angle
          }, function(nv) {
            if (!firsttime) {
              scope.rerender(nv);
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
          var a0_radius = 20;

          var molecular_orbital;
          var mo_group;
          var color = d3.scale.category20();

          scope.rerender = function(angle) {
            var mat = rot_mat(angle)
            mo_group.each(function(mo) {
              if (mo.degen !== 0) {
                if (mo.energy == -1) {
                  var phi1 = [-0.57735027, -0.28867513,  0.28867513,  0.57735027,  0.28867513, -0.28867513]
                  var phi2 = [ 0.0,         0.5,         0.5,         0.0,        -0.5,        -0.5       ]
                }
                else {
                  var phi1 = [ 0.57735027, -0.28867513, -0.28867513,  0.57735027, -0.28867513, -0.28867513]
                  var phi2 = [ 0.0,        -0.5,         0.5,         0.0,        -0.5,         0.5       ]
                }
                if (mo.degen === -1) {
                  var psi = []
                  phi1 = phi1.map(function(x) {return x * mat[0][0]})
                  phi2 = phi2.map(function(x) {return x * mat[1][0]})
                  for(var i = 0; i < phi1.length; i++){
                    psi.push(phi1[i] + phi2[i]);
                  }
                }
                else {
                  var psi = []
                  phi1 = phi1.map(function(x) {return x * mat[0][1]})
                  phi2 = phi2.map(function(x) {return x * mat[1][1]})
                  for(var i = 0; i < phi1.length; i++){
                    psi.push(phi1[i] + phi2[i]);
                  }
                }
                molecular_orbital = d3.select(this)
                .selectAll('circle')
                .attr('r', function(coef, index) { return Math.abs(psi[index]) * a0_radius}) // use abs instead of pow so that the circle area corresponds to magnitude instead of circle radius
                .attr('fill', function(coef, index) { return color(Math.sign(psi[index])); })
              }
            })
          }

          scope.render = function(data) {
            // remove all previous items before render
            svg.selectAll('*').remove();

            // If we don't pass any data, return out of the element
            if (!data) return;

            // setup variables
            // var width = d3.select(element[0]).node().offsetWidth - margin,
            //     // calculate the height
            //     height = scope.data.length * (barHeight + barPadding),
            //     // Use the category20() scale function for multicolor support
            //     // our xScale
            //     xScale = d3.scale.linear()
            //       .domain([0, d3.max(data, function(d) {
            //         return d.score;
            //       })])
            //       .range([0, width]);

            // set the height based on the calculations above
            var energyScale = d3.scale.linear()
                              .domain([2,-2])
                              .range([50, 250]);
            var dataset = {"0": "\u03B1",
                           "-1": "\u03B1 + \u03B2",
                           "-2": "\u03B1 + 2\u03B2",
                           "1": "\u03B1 - \u03B2",
                           "2": "\u03B1 - 2\u03B2" }
            var yAxis = d3.svg.axis()
                  .scale(energyScale)
                  .orient("left")
                  .ticks(5)
                  .tickFormat(function(d) {
                    return dataset[d];
                  })



            mo_group = svg.selectAll('g')
              .data(data).enter()
              .append('g')
              .each(function(mo, index) {
                molecular_orbital = d3.select(this)
                .selectAll('circle')
                .data(mo.vec).enter()
                .append('circle')
                .attr('cx', function(coef, index) {
                  var x = hex_coords[index][0] * hex_radius + 160;
                  if (mo.degen !== 0) {
                    x += mo.degen * degeneracy_offset;
                  }
                  return x
                })
                .attr('cy', function(coef, index) {
                  return hex_coords[index][1] * hex_radius + energyScale(mo.energy);
                })
                .attr('fill', function(coef) { return color(Math.sign(coef)); })
                .attr('r', 0)
                .transition()
                .duration(1000)
                .attr('r', function(coef) { return Math.abs(coef) * a0_radius}) // use abs instead of pow so that the circle area corresponds to magnitude instead of circle radius
                molecular_orbital

                var subscripts = '₁₂₃₄₅₆'
                var text = svg.append("foreignObject")
                .attr("width",100)
                .attr("height",100)
                // text.text("$$\\psi_" + (index + 1)+ "$$")
                text.text("\u03C8" + subscripts[index])
                .attr('x', function(coef, index) {
                  var x = 185;
                  if (mo.degen !== 0) {
                    x += mo.degen * degeneracy_offset;
                  }
                  return x
                })
                .attr('y', energyScale(mo.energy) - 12)
              })
            svg.selectAll('g')
              .append('g')
              .each(function(mo, index) {
                var molecular_orbital = d3.select(this)
                .selectAll('line')
                .data(mo.vec).enter()
                .append('line')
                .attr('x1', function(coef, index) {
                  var x = hex_coords[index][0] * hex_radius + 160;
                  if (mo.degen !== 0) {
                    x += mo.degen * degeneracy_offset;
                  }
                  return x
                })
                .attr('y1', function(coef, index) {
                  return hex_coords[index][1] * hex_radius + energyScale(mo.energy);
                })
                .attr('x2', function(coef, index) {
                  var x = hex_coords[(index + 1) % 6][0] * hex_radius + 160;
                  if (mo.degen !== 0) {
                    x += mo.degen * degeneracy_offset;
                  }
                  return x
                })
                .attr('y2', function(coef, index) {
                  return hex_coords[(index + 1) % 6][1] * hex_radius + energyScale(mo.energy);
                })
                .attr('stroke', "gray")
                .attr('stroke-width', 0)
                .transition()
                .duration(1000)
                .attr('stroke-width', 1)
              })
              .append("g")
              .attr("class", "axis")
              .attr("transform", "translate(" + 50 + ",0)")
              .call(yAxis)
          };

          scope.render(scope.data)
        });
      }
    }
}]);

function rot_mat(angle) {
  angle = angle / 360.0 * 2 * Math.PI
  return [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]]
}
