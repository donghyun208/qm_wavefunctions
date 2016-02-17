'use strict';

/**
 * @ngdoc service
 * @name qmWaveApp.Ring
 * @description
 * # Ring
 * Service in the qmWaveApp.
 */
angular.module('qmWaveApp')
  .service('Ring', ['Wavefunction', 'Plot', function (Wavefunction, Plot) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    // AngularJS will instantiate a singleton by calling "new" on this function
    var N = 60;
    var num_states = 3;
    var xArray = [];
    var axisWidth = Plot.axisWidth;
    var uncoupledEigenstates = [];


    var wavePartRing = new Wavefunction.Wavefunction(xArray);

    for (var i=0; i<=N; i++)
        xArray[i] = -axisWidth / 2 + i * axisWidth / N;

    var states = [0, 1, -1, 2, -2, 3, -3]
    for (var i=0; i < num_states; i++) {
        var qn = states[i];
        var en = 5 * Math.pow(qn, 2);
        var eig = makeStationaryPinRing(xArray, qn);
        var soln = new Wavefunction.Eigenstate(xArray, eig[0], eig[1], en, qn);
        wavePartRing.addState(soln);
    }
    // for (var i=0; i < num_states; i++) {
    //     var en = i + 1;
    //     var eig = makeStationaryPinStep(xArray, -en);
    //     var soln = new Wavefunction.Eigenstate(xArray, eig[0], eig[1], en, -en);
    //     wavePartRing.addState(soln);
    // }
    wavePartRing.normalize()
    var modulus = new Wavefunction.Modulus(wavePartRing);

    return {
        // eigenstates: uncoupledEigenstates,
        superposition: wavePartRing,
        modulus: modulus
    }
  }]);

function makeStationaryPinRing(xArray, quantum_num){
    /** this only runs once, at the begining of the simulation, since they are stationary. **/
    var height = 30;
    var realWave = [];
    var imWave = [];
    var length = xArray[xArray.length - 1] - xArray[0];
    var l = xArray.length;
    for (var i=0; i<l; i++){
        var x = xArray[i];
        realWave[i] = height * Math.cos(quantum_num * (2 * Math.PI / length * x - Math.PI/2));
        imWave[i] = -height * Math.sin(quantum_num * (2 * Math.PI / length * x - Math.PI/2));
    }
    return [realWave, imWave]
}

