'use strict';

/**
 * @ngdoc service
 * @name qmWaveApp.PartInBox
 * @description
 * # PartInBox
 * Service in the qmWaveApp.
 */
angular.module('qmWaveApp')
  .service('PartInBox', ['Wavefunction', 'Plot', function (Wavefunction, Plot) {

    var N = 60;
    var num_states = 3;
    var xArray = [];
    var axisWidth = Plot.axisWidth;
    var uncoupledEigenstates = [];


    for (var i=0; i<=N; i++)
        xArray[i] = -axisWidth / 2 + i * axisWidth / N;

    var v_list = makePartInBoxPotential(xArray);
    var potential = new Wavefunction.Potential(v_list[0], v_list[1], v_list[2]);
    var waveBox = new Wavefunction.Wavefunction(xArray);
    var waveBox2 = new Wavefunction.Wavefunction(xArray);

    for (var i=0; i < num_states; i++) {

        // soln = makeStationaryPinRing(xArray, i-3);
        // en = Math.pow(i - 3, 2);
        // soln = new Wavefunction.Eigenstate(xArray, soln[0], soln[1], en, i + 1);
        // waveRing.eigenList.push(soln);

        var en = Math.pow(i + 1, 2);
        var soln = makeStationaryPinBox(xArray, i + 1);
        var eig = new Wavefunction.Eigenstate(xArray, soln[0], soln[1], en, i + 1);
        var eigCopy = new Wavefunction.Eigenstate(xArray, soln[0], soln[1], en, i + 1);
        waveBox.addState(eig);
        uncoupledEigenstates.push(eigCopy)

        if (i<2) {
          waveBox2.addState(eig);
        }
    }
    waveBox.normalize()
    var modulus = new Wavefunction.Modulus(waveBox);

    waveBox2.normalize()
    var modulus2 = new Wavefunction.Modulus(waveBox2);
    return {
        eigenstates: uncoupledEigenstates,
        superposition: waveBox,
        superposition2: waveBox2,
        modulus: modulus,
        modulus2: modulus2,
        potential: potential
    }
  }]);


function makeStationaryPinBox(xArray, quantum_num){
    /** this only runs once, at the begining of the simulation, since they are stationary. **/
    var height = 30;
    var realWave = [];
    var imWave = [];
    var length = xArray[xArray.length - 1] - xArray[0];
    var l = xArray.length;
    var x;
    for (var i=0; i<l; i++){
        x = xArray[i];
        realWave[i] = height * Math.sin(quantum_num * (Math.PI / length * x + Math.PI / 2));
        imWave[i] = 0;
    }
    return [realWave, imWave]
}

function makePartInBoxPotential(xArray){
    /** this only runs once, at the begining of the simulation, since they are stationary. **/
    var height = 50;

    var l = xArray.length;
    var x = [xArray[0], xArray[0], xArray[l-1], xArray[l-1]]
    var real = [height, 0, 0, height]
    var im = [0, 0, 0, 0]

    return [x, real, im]
}
