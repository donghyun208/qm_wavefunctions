'use strict';

/**
 * @ngdoc service
 * @name qmWaveApp.Plot
 * @description controls plot attributes and holds shared plot functions
 * # Plot
 * Service in the qmWaveApp.
 */
angular.module('qmWaveApp')
  .service('Plot', ['$rootScope', 'Colorwheel', 'Timer', function (rootScope, Colorwheel, Timer) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.canvasWidth = 230;
    this.canvasHeight = 150;

    this.xOrigin = this.canvasWidth / 2;
    this.yOrigin = this.canvasHeight / 2;

    this.phaseOriginX = 40;
    this.phaseOriginY = 40;
    this.phaseRadius = 35;



    this.axisWidth = 200;

    this.theta = 0.0;
    this.phi = -0.0;

    this.pitch = 0;
    this.yaw = 0;

    var newX = [1.0, 0.0, 0.0];
    var newY = [0.0, 1.0, 0.0];
    var newZ = [0.0, 0.0, 1.0];
    this.rotatedFrame = [newX, newY, newZ];

    var self = this;
    rootScope.$watchCollection(
      function() { return [self.pitch, self.yaw]},
      function(nv, ov) {
        var rot_mat = rot_mat_angle(1, 0, 0, self.pitch);
        // var rot_mat = rot_mat_angle(self.rotatedFrame[0][0], self.rotatedFrame[0][1], self.rotatedFrame[0][2], self.pitch);
        var newZ = apply_mat(rot_mat, self.rotatedFrame[2])
        var newY = apply_mat(rot_mat, self.rotatedFrame[1])
        var newX = apply_mat(rot_mat, self.rotatedFrame[0])
        var rot_mat = rot_mat_angle(self.rotatedFrame[1][0], self.rotatedFrame[1][1], self.rotatedFrame[1][2], self.yaw);
        var newZ = apply_mat(rot_mat, newZ)
        var newY = apply_mat(rot_mat, newY)
        var newX = apply_mat(rot_mat, newX)

        self.rotatedFrame = [newX, newY, newZ];
        self.theta =  Math.acos(newZ[2])
        self.phi =  Math.atan2(newZ[1], newZ[0])
      })

    this.drawAxis = function(ctx) {
        var startX = -this.axisWidth / 2.0;
        var endX = this.axisWidth / 2.0;
        var startY = -50;
        var endY = 50;
        var startZ = -50;
        var endZ = 50;

        //X-axis
        var lineStart = this.coord2plot(startX, 0, 0);
        var lineEnd = this.coord2plot(endX, 0, 0);
        // console.log(lineStart, lineEnd)
        drawPath(ctx, lineStart[0], lineStart[1], lineEnd[0], lineEnd[1]);

        //Y-axis
        lineStart = this.coord2plot(0, startY, 0);
        lineEnd = this.coord2plot(0, endY, 0);
        drawPath(ctx, lineStart[0], lineStart[1], lineEnd[0], lineEnd[1]);

        //Z-axis
        lineStart = this.coord2plot(0, 0, startZ);
        lineEnd = this.coord2plot(0, 0, endZ);
        drawPath(ctx, lineStart[0], lineStart[1], lineEnd[0], lineEnd[1]);
    }

    this.drawSingleFcn = function(ctx, vectors, colorOption) {
        //newX, newY, newZ are the unit vector positions of the rotated frame in terms of the fixed fram unit vector positions of the rotated frame in terms of the fixed frame.
        //ie. if the graph frame starts at x=[1,0,0], y=[0,1,0], z=[0,0,1], upon rotation of the view, these three vectors will rotate.
        var vecX = vectors[0];
        var vecY = vectors[1];
        var vecZ = vectors[2];
        var l = vecX.length;

        // //Loops over every "x" point in a wavefunction
        // var plotCoordSaved = [];
        // for (var i=0; i<l; i++) {
        //     var x = vecX[i];
        //     var y = vecY[i];
        //     var z = vecZ[i];

        //     var phase = Math.PI + Math.atan2(-z, -y); // [0,2pi]
        //     var color = Colorwheel.getColor(phase);
        //     var plotCoord = this.coord2plot(x, y, z);
        //     plotCoordSaved.push(plotCoord);

        //     if (i != 0)
        //         ctx.lineTo(plotCoord[0], plotCoord[1]);
        //     else {
        //         //if this is the first point, begin drawing the path
        //         ctx.beginPath();
        //         ctx.strokeStyle = "#000000";
        //         ctx.moveTo(plotCoord[0], plotCoord[1]);
        //     }
        // }
        // ctx.stroke();
        // ctx.closePath();

        // for (var i=0; i<l; i++) {
        //     //every 5 points, drop a line down to the x axis
        //     if (Math.round(i) % 3 == 0){
        //         var plotCoord = plotCoordSaved[i];
        //         // console.log(plotCoord)
        //         var x = vecX[i];
        //         var y = vecY[i];
        //         var z = vecZ[i];

        //         var phase = Math.PI + Math.atan2(-z, -y); // [0,2pi]
        //         var color = Colorwheel.getColor(phase);

        //         ctx.beginPath();
        //         ctx.strokeStyle = color;
        //         ctx.moveTo(plotCoord[0], plotCoord[1]);
        //         var projX = this.coord2plot(x, 0, 0);
        //         ctx.lineTo(projX[0], projX[1]);
        //         ctx.stroke();
        //         ctx.closePath();
        //     }
        // }
        // ctx.strokeStyle = "#000000";

        //Loops over every "x" point in a wavefunction
        var x, y, z, plotCoord, projX, phase, color, prevColor;

        ctx.strokeStyle = "#000000";
        for (var i=0; i<l; i++) {
            x = vecX[i];
            y = vecY[i];
            z = vecZ[i];

            plotCoord = this.coord2plot(x, y, z);

            if (Math.round(i) % 3 == 0){
                phase = Math.PI + Math.atan2(-z, -y); // [0,2pi]
                if (colorOption == 'off') {
                    color = "#000000"
                }
                else {
                    color = Colorwheel.getColor(phase);
                }

                if (i !== 0) {
                    ctx.lineTo(plotCoord[0], plotCoord[1]);
                    if (color !== prevColor) {
                        ctx.stroke();
                        ctx.closePath();
                        ctx.beginPath();
                        ctx.strokeStyle = color;
                        ctx.moveTo(plotCoord[0], plotCoord[1]);
                    }
                }
                else {
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.moveTo(plotCoord[0], plotCoord[1]);
                }
                projX = this.coord2plot(x, 0, 0);
                ctx.lineTo(projX[0], projX[1]);
                ctx.moveTo(plotCoord[0], plotCoord[1]);
                prevColor = color;
            }
            else {
                ctx.lineTo(plotCoord[0], plotCoord[1]);
            }
        }
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle = "#000000";
    }

    this.coord2plot = function(x, y, z) {
        //given the vector in the graph coordinates, will rotate the vector into the view coordinates, and then project that view onto the screen coordinates
        var xHat = this.rotatedFrame[0];
        var yHat = this.rotatedFrame[1];
        var zHat = this.rotatedFrame[2];
        var vec = rotation(this.theta, this.phi, x, y, z);
        var vec = [x, y, z]
        var newX = this.xOrigin + vec[0] * xHat[0] + vec[1] * yHat[0] + vec[2] * zHat[0];
        var newY = this.yOrigin - (vec[0] * xHat[1] + vec[1] * yHat[1] + vec[2] * zHat[1]);
        var newZ = vec[0] * xHat[2] + vec[1] * yHat[2] + vec[2] * zHat[2];
        return [newX, newY, newZ]
        // return [x,y,z]
    }

    this.animList = []

    // rootScope.$watch(function() {return Timer.paused},
    //   function(nv, ov) {
    //     console.log(nv)
    //     if (nv == true) {
    //       console.log('pausing')
    //       for (var i=0; i<self.animList.length; i++) {
    //         self.animList[i].pause()
    //       }
    //     }
    //     else {
    //       console.log('resuming')
    //       for (var i=0; i<self.animList.length; i++) {
    //         self.animList[i].resume()
    //       }
    //     }
    //   });

    this.initPhase = function(canvas, wave) {
        var phaseCircle = canvas.set()
        var phaseHand = canvas.set();

        phaseCircle.push(canvas.circle(this.phaseOriginX, this.phaseOriginY, this.phaseRadius));
        phaseCircle.push(canvas.path("M" + [this.phaseOriginX, this.phaseOriginY + this.phaseRadius] + 'L' + [this.phaseOriginX, this.phaseOriginY - this.phaseRadius] + 'Z'));
        phaseCircle.push(canvas.path("M" + [this.phaseOriginX + this.phaseRadius, this.phaseOriginY] + 'L' + [this.phaseOriginX - this.phaseRadius, this.phaseOriginY] + 'Z'));
        phaseCircle.attr({"stroke": "#c2bcb5", "stroke-width": "1"});

        var handLine = canvas.path("M" + [this.phaseOriginX, this.phaseOriginY] + 'L' + [this.phaseOriginX, this.phaseOriginY - this.phaseRadius] + 'Z')
        handLine.attr({"stroke": "black", "stroke-width": "2"});
        var handDot = canvas.circle(this.phaseOriginX, this.phaseOriginY - this.phaseRadius, 3)
        handDot.attr({"stroke": "black", "stroke-width": "1", "fill": "orange"});
        phaseHand.push(handLine)
        phaseHand.push(handDot)

        //animation start:
        // handLine.animate(anim);
        // handDot.animate(anim);
        // this.animList.push(handLine);
        // this.animList.push(handDot);
        // var anim = Raphael.animation({transform: "r-360," + [this.phaseOriginX, this.phaseOriginY]}, 5000).repeat(Infinity);
        var anim = Raphael.animation({transform: "r-360," + [this.phaseOriginX, this.phaseOriginY]}, 5000).repeat(Infinity)
        phaseHand.animate(anim);
        rootScope.$watch(function() {return Timer.paused},
          function(nv, ov) {
            if (nv == true) {
              console.log('pausing')
              // phaseHand.stop(anim)
              phaseHand.pause(anim)
            }
            else {
              // anim = Raphael.animation({transform: "r-360," + [self.phaseOriginX, self.phaseOriginY]}, 5000)
              // phaseHand.animate(anim);
              console.log('resuming')
              phaseHand.resume()
            }
          });
    }


  }]);

function rotation(theta, phi, x, y, z){
    var cosT = Math.cos(theta)
    var sinT = Math.sin(theta)
    var cosP = Math.cos(phi)
    var sinP = Math.sin(phi)

    var nx = x * cosT * cosP - y * sinP + z * sinT * cosP
    var ny = x * cosT * sinP + y * cosP + z * sinT * sinP
    var nz = -x * sinT + z * cosT
    //var nx = x * cosT - y * cosP * sinT + z * sinP * sinT;
    // var ny = x * sinT + y * cosP * cosT - z * sinP * cosT;
    // var nz = y * sinP + z * cosT
    return [nx, ny, nz]
}

function drawPath(ctx, x0,y0, x1,y1){
    ctx.beginPath();

    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);

    ctx.stroke();
    ctx.closePath();
}

function rot_mat_angle(vx, vy, vz, angle) {
    // Forms the Rotation Matrix needed to rotate about vector v.
    // angle should be in radians

    var cosTheta = Math.cos(angle);
    var sinTheta = Math.sin(angle);



    var mag = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2) + Math.pow(vz, 2));
    var ux = vx / mag;
    var uy = vy / mag;
    var uz = vz / mag;
    return [[cosTheta + Math.pow(ux, 2) * (1-cosTheta),      ux*uy * (1-cosTheta) - uz * sinTheta, ux*uz * (1-cosTheta) + uy * sinTheta],
            [uy*ux * (1-cosTheta) + uz * sinTheta, cosTheta + Math.pow(uy, 2) * (1-cosTheta),      uy*uz * (1-cosTheta) - ux * sinTheta],
            [uz*ux * (1-cosTheta) - uy * sinTheta, uz*uy * (1-cosTheta) + ux * sinTheta, cosTheta + Math.pow(uz, 2) * (1-cosTheta)]]
}

function apply_mat(mat, vec) {
  return [mat[0][0] * vec[0] + mat[0][1] * vec[1] + mat[0][2] * vec[2],
          mat[1][0] * vec[0] + mat[1][1] * vec[1] + mat[1][2] * vec[2],
          mat[2][0] * vec[0] + mat[2][1] * vec[1] + mat[2][2] * vec[2]]
}
