'use strict';

/**
 * @ngdoc service
 * @name qmWaveApp.PartInBox
 * @description
 * # PartInBox
 * Service in the qmWaveApp.
 */
angular.module('qmWaveApp')
  .service('PartInBox', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var N = 60;
    var num_states = 3;
    var axisWidth = 300;
    var canvasWidth = 330;
    var canvasHeight = 275;
    var xArray = [];

    for (var i=0; i<=N; i++)
        xArray[i] = -axisWidth / 2 + i * axisWidth / N;

    var waveBox = new Wavefunction(xArray);

    for (var i=0; i < num_states; i++){
        // var en = i + 0.5;
        // var soln = makeStationaryHO(xArray, i);
        // soln = new Eigenstate(xArray, soln[0], soln[1], en, i + 1);
        // waveHO.eigenList.push(soln);

        // soln = makeStationaryPinRing(xArray, i-3);
        // en = Math.pow(i - 3, 2);
        // soln = new Eigenstate(xArray, soln[0], soln[1], en, i + 1);
        // waveRing.eigenList.push(soln);

        var en = Math.pow(i + 1, 2);
        var soln = makeStationaryPinBox(xArray, i + 1);
        soln = new Eigenstate(xArray, soln[0], soln[1], en, i + 1);
        $scope.waveBox.addState(soln);
    }

    // var plots = [];
    var modulus = new Modulus(waveBox);
    // plots[0].fcnList = waveBox.eigenList;
    // plots[1].fcnList = [waveBox];
    // plots[2].fcnList = [modulus];

    // for (var i=0; i < num_states; i++){
    //     plots[i+3].fcnList = [waveBox.eigenList[i]];
    // }
    // setInterval(function () { draw(param, plots); }, 30);             // drawing loop 1/20th second

    return {
        eigenstates: waveBox.eigenList,
        superposition: waveBox,
        modulus: modulus
    }
  });


function makeStationaryPinBox(xArray, quantum_num){
    /** this only runs once, at the begining of the simulation, since they are stationary. **/
    var height = 20;
    var realWave = [];
    var imWave = [];
    var length = xArray[xArray.length - 1] - xArray[0];
    var l = xArray.length;
    var x;
    for (var i=0; i<l; i++){
        x = xArray[i];
        realWave[i] = -height * Math.sin(quantum_num * (Math.PI / length * x - Math.PI / 2));
        imWave[i] = 0;
    }
    return [realWave, imWave]
}
