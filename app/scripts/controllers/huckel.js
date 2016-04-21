'use strict';

/**
 * @ngdoc function
 * @name qmWaveApp.controller:HuckelCtrl
 * @description
 * # HuckelCtrl
 * Controller of the qmWaveApp
 */
angular.module('qmWaveApp')
  .controller('HuckelCtrl', ['$scope', function ($scope) {
    $scope.mix_angle = 0;
    $scope.slider = {
      floor: 0,
      ceil: 360
    };

    var psi1 = {energy: -2, degen:  0, vec: [ 0.40824829,  0.40824829,  0.40824829,  0.40824829,  0.40824829,  0.40824829], nodes: []};
    var psi2 = {energy: -1, degen: -1, vec: [-0.57735027, -0.28867513,  0.28867513,  0.57735027,  0.28867513, -0.28867513], nodes: [0]};
    var psi3 = {energy: -1, degen:  1, vec: [ 0.0,         0.5,         0.5,         0.0,        -0.5,        -0.5       ], nodes: [90]};
    var psi4 = {energy:  1, degen: -1, vec: [ 0.57735027, -0.28867513, -0.28867513,  0.57735027, -0.28867513, -0.28867513], nodes: [45, 135]};
    var psi5 = {energy:  1, degen:  1, vec: [ 0.0,        -0.5,         0.5,         0.0,        -0.5,         0.5       ], nodes: [0, 90]};
    var psi6 = {energy:  2, degen:  0, vec: [ 0.40824829, -0.40824829,  0.40824829, -0.40824829,  0.40824829, -0.40824829], nodes: [0, 60, 120]};

    var psiB_p = angular.copy(psi2)
    var psiB_m = angular.copy(psi3)
    var psiA_p = angular.copy(psi4)
    var psiA_m = angular.copy(psi5)

    $scope.benzene = [psi1, psi2, psi3, psi4, psi5, psi6];
    $scope.benzene_rotate = [psi1, psiB_p, psiB_m, psiA_p, psiA_m, psi6]

    // var self = $scope.
    $scope.$watch(function() {
      return $scope.mix_angle
    }, function(nv) {
      mix(psi2, psi3, psiB_p, psiB_m, $scope.mix_angle)
      mix(psi4, psi5, psiA_p, psiA_m, $scope.mix_angle)
      psiB_p.nodes = psi2.nodes.map(function(x) { return x + $scope.mix_angle })
      psiB_m.nodes = psi3.nodes.map(function(x) { return x + $scope.mix_angle })
      psiA_p.nodes = psi4.nodes.map(function(x) { return x + $scope.mix_angle / 2.0})
      psiA_m.nodes = psi5.nodes.map(function(x) { return x + $scope.mix_angle / 2.0})
    });

    function mix(phi_1, phi_2, phi_A, phi_B, mix_angle) {
      var mat = rot_mat(mix_angle);
      for(var i = 0; i < phi_1.vec.length; i++){
        phi_A.vec[i] = phi_1.vec[i] * mat[0][0] + phi_2.vec[i] * mat[1][0];
        phi_B.vec[i] = phi_1.vec[i] * mat[0][1] + phi_2.vec[i] * mat[1][1];
      }
    };

    function rot_mat(angle) {
      angle = angle / 360.0 * 2 * Math.PI
      return [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]]
    };

  }]);


