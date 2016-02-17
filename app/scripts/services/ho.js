'use strict';

/**
 * @ngdoc service
 * @name qmWaveApp.HO
 * @description
 * # HO
 * Service in the qmWaveApp.
 */
angular.module('qmWaveApp')
  .service('HO', ['Wavefunction', 'Plot', function (Wavefunction, Plot) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var N = 60;
    var num_states = 3;
    var xArray = [];
    var axisWidth = Plot.axisWidth;
    var uncoupledEigenstates = [];


    for (var i=0; i<=N; i++)
        xArray[i] = -axisWidth / 2 + i * axisWidth / N;

    var v_list = makeHOPotential(xArray);
    var potential = new Wavefunction.Potential(v_list[0], v_list[1], v_list[2]);
    var waveHO = new Wavefunction.Wavefunction(xArray);

    for (var i=0; i < num_states; i++) {
        var en = i + 0.5;
        var eig = makeStationaryHO(xArray, i);
        var soln = new Wavefunction.Eigenstate(xArray, eig[0], eig[1], en, i);
        // var eig = new Wavefunction.Eigenstate(xArray, soln[0], soln[1], en, i + 1);
        // var eigCopy = new Wavefunction.Eigenstate(xArray, soln[0], soln[1], en, i + 1);
        // uncoupledEigenstates.push(eigCopy)
        waveHO.addState(soln);
    }
    waveHO.normalize()
    var modulus = new Wavefunction.Modulus(waveHO);

    return {
        // eigenstates: uncoupledEigenstates,
        superposition: waveHO,
        modulus: modulus,
        potential: potential
    }
  }]);


function makeStationaryHO(xArray, quantum_num){
    /** this only runs once, at the begining of the simulation, since they are stationary. **/
    var height = 40;
    var realWave = [];
    var imWave = [];
    var length = xArray[xArray.length - 1] - xArray[0];
    var hermite;
    var factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];
    var norm = 1 / (Math.sqrt(Math.pow(2, quantum_num)) * factorials[quantum_num]);
    var l = xArray.length;
    var x, hermite;

    for (var i=0; i<l; i++){
        x = xArray[i] / 30;
        switch (quantum_num){
        case 0:
            hermite = 1;
            break;
        case 1:
            hermite = 2 * x;
            break;
        case 2:
            hermite = 4 * x * x - 2;
            break;
        case 3:
            hermite = 8 * Math.pow(x, 3) - 12 * x;
            break;
        case 4:
            hermite = 16 * Math.pow(x, 4) - 48 * x * x + 12;
            break;
        case 5:
            hermite = 32 * Math.pow(x, 5) - 160 * Math.pow(x, 3) + 120 * x;
            break;
        case 6:
            hermite = 64 * Math.pow(x, 6) - 480 * Math.pow(x, 4) + 720 * x * x - 120;
            break;
        case 7:
            hermite = 128 * Math.pow(x, 7) - 1344 * Math.pow(x, 5) + 3360 * Math.pow(x, 3) - 1680 * x;
            break;
            }
        realWave[i] = height * norm * hermite * Math.exp(-x * x / 2);
        imWave[i] = 0;
    }
    return [realWave, imWave]
}

function makeHOPotential(xArray){
    /** this only runs once, at the begining of the simulation, since they are stationary. **/

    var force_constant = 0.005;

    var l = xArray.length;
    var real = []
    var im = []

    for (var i=0; i<l; i++){
        real.push(force_constant * Math.pow(xArray[i], 2))
        im.push(0)
    }

    return [xArray, real, im]
}
