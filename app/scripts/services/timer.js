'use strict';

/**
 * @ngdoc service
 * @name qmWaveApp.timer
 * @description
 * # timer
 * Factory in the qmWaveApp.
 */
angular.module('qmWaveApp')
  .factory('Timer', ['$interval', function ($interval) {
    var timerObj = {time: 0, paused: true}
    var timePropagate;
    var startEvolution = function(){
      if (!angular.isDefined(timePropagate)) {
        timePropagate = $interval(function() {
            timerObj.time += 0.105
        }, 15);   // 10ms -> 100fps
        timerObj.paused = false;
      }
    };

    var stopEvolution = function(){
      if (angular.isDefined(timePropagate)) {
        $interval.cancel(timePropagate);
        timePropagate = undefined;
      };
      timerObj.paused = true;
    };

    var toggleEvolution = function(){
      if (angular.isDefined(timePropagate)) {
        stopEvolution()
        timerObj.paused = true;
      }
      else {
        startEvolution()
        timerObj.paused = false;
      };
      return timerObj.paused;
    };

    timerObj.start = startEvolution;
    timerObj.stop = stopEvolution;
    timerObj.toggle = toggleEvolution;
    return timerObj;
  }]);
