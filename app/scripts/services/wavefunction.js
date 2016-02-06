'use strict';

/**
 * @ngdoc service
 * @name qmWaveApp.Wavefunction
 * @description
 * # Wavefunction
 * Factory in the qmWaveApp.
 */
angular.module('qmWaveApp')
  .factory('Wavefunction', ['$rootScope', 'Timer', function (rootScope, Timer) {
    // Service logic
    //The three function classes here hold the information for a line function in 3 dimensions. timeEvolve updates each of the functions to the current time.
    //
    //
    //
    //Eigenstate Class, which organizes an energy eigenstate's x, Re, Im parts, and stores the timeEvolve method.
    rootScope.Math = window.Math;
    function Eigenstate(x, y, z, energy, quantum_number){
        this._x = x;
        this.y0 = y; //real part at t=0
        this.z0 = z; //imaginary part at t=0

        //Slice makes a copy of the array, so they can be independently manipulated
        this._y = y.slice(0); //re(psi(t))
        this._z = z.slice(0); //im(psi(t))

        this.number = quantum_number;
        this.energy = energy;

        this.wavefunction;

        this.currPhase = 0
        //intial of this eigenstate
        this.initPhase = 0
        // intial magnitude of this eigenstate (NOTE: ranges from 0-100 to
        // accomodate the fact that rz-slider only takes integer values. divide by
        // 100 to obtain true magnitude)
        this.mag = 100

        // this.update is used to trigger Plot updates
        this.update = 1;


        var self = this;
        rootScope.$watchCollection(
          function() { return [Timer.time, self.initPhase, self.mag]},
          function(nv, ov) {
            self.timeEvolve()
          })
    }

    Eigenstate.prototype.getVectors = function(){
        return [this._x, this._y, this._z]
    }

    // Eigenstate.prototype.changePhase = function(newPhase){
    //     // expected newPhase to be in degrees. change it to radians
    //     if (isNaN(parseFloat(newPhase)) || !isFinite(newPhase)) {
    //         this.initPhase = 0
    //     }
    //     else {
    //         this.initPhase = newPhase
    //     }
    //     console.log(this.initPhase)
    // }

    Eigenstate.prototype.timeEvolve = function(){

        this.currPhase = this.initPhase * Math.PI / 180.0 + this.energy * Timer.time / 50;
        this.re_proj = Math.cos(this.currPhase);
        this.im_proj = -Math.sin(this.currPhase);
        var l = this._x.length;
        for (var i=0; i<l; i++){
            this._y[i] = this.mag / 100 * (this.re_proj * this.y0[i] + this.im_proj * this.z0[i]);
            this._z[i] = this.mag / 100* (this.im_proj * this.y0[i] - this.re_proj * this.z0[i]);
        }

        this.update += 1
    }

    Eigenstate.prototype.getModulus = function(){
        if (angular.isDefined(this.modulus))
            return this.modulus
        else {
            var waveBox = new Wavefunction(this._x);
            waveBox.addState(this)
            this.modulus = new Modulus(waveBox);
            return this.modulus
        }
    }

    Eigenstate.prototype.renormalize = function(){
        var eigenlist = this.wavefunction.eigenList;
        for (var i=0; i<eigenlist.length; i++){
            if (eigenlist[i] == this) {
                break
            }
        }
        this.wavefunction.normalize(i)
    }


    //This is the Wavefunction Class, which is a superposition of Eigenstates. Does a vector addition of all the wavefucntions in waveList.
    function Wavefunction(x){
        this.eigenList = [];                  //List of Eigenstates
        this._x = x;
        this._y = new Array(x.length);
        this._z = new Array(x.length);

        // this.update is used to trigger Plot updates
        this.update = 1;

        var self = this;
        var watchList;
        // rootScope.$watch(
        //   function() { return Timer.time },
        //   function(nv, ov) {
        //     self.timeEvolve()
        //   })

        rootScope.$watchCollection(
          function() {
            watchList = [Timer.time]
            for (var i=0; i<self.eigenList.length; i++) {
                watchList.push(self.eigenList[i].initPhase, self.eigenList[i].mag)
            }
            // console.log(watchList)
            return watchList;
          },
          function(nv, ov) {
            self.timeEvolve()
          })
    }

    Wavefunction.prototype.addState = function(state){
        state.wavefunction = this;
        this.eigenList.push(state);
    }

    Wavefunction.prototype.getVectors = function(){
        //returns x list, y list, z list (list of points)
        return [this._x, this._y, this._z]
    }

    Wavefunction.prototype.timeEvolve = function(){
        var l = this._x.length;
        var m = this.eigenList.length;
        for (var i=0; i<l; i++){
            this._y[i] = 0;
            this._z[i] = 0;
            for (var j=0; j<m; j++){
                this._y[i] += this.eigenList[j]._y[i];
                this._z[i] += this.eigenList[j]._z[i];
            }
        }

        this.update += 1
    }

    Wavefunction.prototype.normalize = function(index) {
        var residualProb = 0;
        var remainingProb = 1;
        if (index == undefined) {
            for (var i=0; i<this.eigenList.length; i++) {
                residualProb += Math.pow(this.eigenList[i].mag / 100.0, 2)
            }
        }
        else {
            for (var i=0; i<this.eigenList.length; i++) {
                if (i == index) {
                    remainingProb -= Math.pow(this.eigenList[i].mag / 100.0, 2)
                }
                else {
                    residualProb += Math.pow(this.eigenList[i].mag / 100.0, 2)
                }
            }
        }

        var multiplicitiveFactor = Math.sqrt(remainingProb / residualProb)
        for (var j=0; j<this.eigenList.length; j++) {
            if (j != index) {
                if (residualProb == 0) {
                    var newMag = multiplicitiveFactor * this.eigenList[j].mag;
                    this.eigenList[j].mag = Math.round(remainingProb / (this.eigenList.length - 1) * 100)
                }
                else {
                    var newMag = multiplicitiveFactor * this.eigenList[j].mag;
                    this.eigenList[j].mag = Math.round(newMag);
                }
            }
        }
        var self = this;

        setTimeout(function() {
            self.timeEvolve()
            rootScope.$digest()
        })
    }


    //This is the modulus class, which finds the modulus of all the wavefunctions in waveList.
    function Modulus(wavefcn){
        this.eigenList = wavefcn.eigenList
        this._x = wavefcn._x;
        this.superY = wavefcn._y;
        this.superZ = wavefcn._z;
        this._y = [];
        this._z = [];

        // this.update is used to trigger Plot updates
        this.update = 1;

        var l = this._x.length;
        for (var i=0; i<l; i++){
            this._z[i] = 0;
        }

        var self = this;
        var watchList;

        rootScope.$watchCollection(
          function() {
            watchList = [Timer.time]
            for (var i=0; i<self.eigenList.length; i++) {
                watchList.push(self.eigenList[i].initPhase, self.eigenList[i].mag)
            }
            // console.log(watchList)
            return watchList;
          },
          function(nv, ov) {
            setTimeout(function() {
              self.timeEvolve()
              rootScope.$digest()
            })
          })
    }

    Modulus.prototype.getVectors = function(){
        return [this._x, this._y, this._z]
    }

    Modulus.prototype.timeEvolve = function(){
        var l = this._x.length;
        for (var i=0; i<l; i++){
            this._y[i] = Math.sqrt(Math.pow(this.superY[i], 2) + Math.pow(this.superZ[i], 2));
        }

        this.update += 1
    }

    // Public API here
    return {
      Eigenstate: Eigenstate,
      Wavefunction: Wavefunction,
      Modulus: Modulus
    };
  }]);

