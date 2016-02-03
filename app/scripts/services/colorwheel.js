'use strict';

/**
 * @ngdoc service
 * @name qmWaveApp.Colorwheel
 * @description
 * # Colorwheel
 * Service in the qmWaveApp.
 */
angular.module('qmWaveApp')
  .service('Colorwheel', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.colors = ['#182226', '#182226', '#182327', '#18252a', '#19272d', '#1a2a30', '#1c2d35', '#1d313a',
                   '#1f3540', '#213a46', '#233e4d', '#254355', '#27475d', '#294c65', '#2b506e', '#2e5476',
                   '#30577f', '#325b88', '#345d90', '#366099', '#3861a1', '#3a63a9', '#3c63b1', '#3e64b8',
                   '#4064be', '#4363c4', '#4563c9', '#4762ce', '#4a61d1', '#4c5fd4', '#4f5ed7', '#515dd8',
                   '#535cd8', '#565ad8', '#5859d7', '#5b5ad4', '#605cd1', '#635dce', '#665fc9', '#6960c4',
                   '#6a60be', '#6a60b8', '#6a60b1', '#695fa9', '#675ea1', '#645c99', '#615a90', '#5c5788',
                   '#58547f', '#535076', '#4d4c6e', '#474865', '#43445d', '#3e4155', '#393d4d', '#343946',
                   '#2f3540', '#2b313a', '#262d35', '#232a30', '#1f272d', '#1d252a', '#1b2327', '#192226']

    this.numColors = this.colors.length;

    this.getColor = function(angle){
        var index = Math.round(angle / (2 * Math.PI) * this.numColors);
        return this.colors[index];
    }
  });
