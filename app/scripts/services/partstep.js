'use strict';

/**
 * @ngdoc service
 * @name qmWaveApp.PartStep
 * @description
 * # PartStep
 * Service in the qmWaveApp.
 */
angular.module('qmWaveApp')
  .service('PartStep', ['Wavefunction', 'Plot', function (Wavefunction, Plot) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var N = 60;
    var num_states = 3;
    var xArray = [];
    var axisWidth = Plot.axisWidth;
    var uncoupledEigenstates = [];


    for (var i=0; i<=N; i++)
        xArray[i] = -axisWidth / 2 + i * axisWidth / N;

    var v_list = makePartStepPotential(xArray);
    var potential = new Wavefunction.Potential(v_list[0], v_list[1], v_list[2]);
    var wavePartStep = new Wavefunction.Wavefunction(xArray);

    for (var i=0; i < num_states; i++) {
        var en = i + 1;
        var eig = makeStationaryPinStep(xArray, en);
        var soln = new Wavefunction.Eigenstate(xArray, eig[0], eig[1], en, i + 1);
        wavePartStep.addState(soln);
    }
    for (var i=0; i < num_states; i++) {
        var en = i + 1;
        var eig = makeStationaryPinStep(xArray, -en);
        var soln = new Wavefunction.Eigenstate(xArray, eig[0], eig[1], en, -en);
        wavePartStep.addState(soln);
    }
    wavePartStep.normalize()
    var modulus = new Wavefunction.Modulus(wavePartStep);

    return {
        // eigenstates: uncoupledEigenstates,
        superposition: wavePartStep,
        modulus: modulus,
        potential: potential
    }
  }]);

function makeStationaryPinStep(xArray, quantum_num){
    /** this only runs once, at the begining of the simulation, since they are stationary. **/
    var height = 20;
    var realWave = [];
    var imWave = [];
    var length = xArray[xArray.length - 1] - xArray[0];
    var l = xArray.length;

    var x;

    var potential = 2.5
    var energy = Math.abs(quantum_num)
    var helicity = Math.sign(quantum_num)
    if (energy < potential){
        var k1 = Math.sqrt(2 * energy);
        var k2 = Math.sqrt(2 * (potential - energy));
        var B_real = (Math.pow(k1, 2) - Math.pow(k2, 2)) / (Math.pow(k1, 2) + Math.pow(k2, 2))
        var B_im = - 2 * k1 * k2 / (Math.pow(k1, 2) + Math.pow(k2, 2))
        var C_real = 1 + B_real;
        var C_im = B_im;

        for (var i=0; i<l; i++){
            x = xArray[i];
            if (x < 0){
                realWave[i] = height * ((1 + B_real) * Math.cos(k1 * (4 * Math.PI / length * x)) + B_im * Math.sin(k1 * (4 * Math.PI / length * x)));
                imWave[i] = helicity * height * ((1 - B_real) * Math.sin(k1 * (4 * Math.PI / length * x)) + B_im * Math.cos(k1 * (4 * Math.PI / length * x)));
            }
            else{
                realWave[i] = height * C_real * Math.exp(-k2 * (4 * Math.PI / length * x));
                imWave[i] = helicity * height * C_im * Math.exp(-k2 * (4 * Math.PI / length * x));
            }
        }
    }
    else{
        var k1 = Math.sqrt(2 * energy);
        var k2 = Math.sqrt(2 * (energy - potential));
        var B = (k1 - k2) / (k1 + k2);
        var C = 1 + B;

        for (var i=0; i<l; i++){
            x = xArray[i];
            if (x < 0){
                realWave[i] = height * (1 + B) * Math.cos(k1 * (4 * Math.PI / length * x));
                imWave[i] = helicity * height * (1 - B) * Math.sin(k1 * (4 * Math.PI / length * x));
            }
            else{
                realWave[i] = height * C * Math.cos(k2 * (4 * Math.PI / length * x));
                imWave[i] = helicity * height * C * Math.sin(k2 * (4 * Math.PI / length * x));
            }
        }
    }
    return [realWave, imWave]
}

function makePartStepPotential(xArray){
    var height = 30;

    var l = xArray.length;
    var mid = xArray.length/2;
    var x = [0, 0, xArray[l-1]]
    var real = [0, height, height]
    var im = [0, 0, 0]

    return [x, real, im]
}
