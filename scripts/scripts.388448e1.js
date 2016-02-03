"use strict";function makeStationaryPinBox(a,b){for(var c,d=30,e=[],f=[],g=a[a.length-1]-a[0],h=a.length,i=0;h>i;i++)c=a[i],e[i]=d*Math.sin(b*(Math.PI/g*c+Math.PI/2)),f[i]=0;return[e,f]}function rotation(a,b,c,d,e){var f=Math.cos(a),g=Math.sin(a),h=Math.cos(b),i=Math.sin(b),j=c*f*h-d*i+e*g*h,k=c*f*i+d*h+e*g*i,l=-c*g+e*f;return[j,k,l]}function drawPath(a,b,c,d,e){a.beginPath(),a.moveTo(b,c),a.lineTo(d,e),a.stroke(),a.closePath()}function rot_mat_angle(a,b,c,d){var e=Math.cos(d),f=Math.sin(d),g=Math.sqrt(Math.pow(a,2)+Math.pow(b,2)+Math.pow(c,2)),h=a/g,i=b/g,j=c/g;return[[e+Math.pow(h,2)*(1-e),h*i*(1-e)-j*f,h*j*(1-e)+i*f],[i*h*(1-e)+j*f,e+Math.pow(i,2)*(1-e),i*j*(1-e)-h*f],[j*h*(1-e)-i*f,j*i*(1-e)+h*f,e+Math.pow(j,2)*(1-e)]]}function apply_mat(a,b){return[a[0][0]*b[0]+a[0][1]*b[1]+a[0][2]*b[2],a[1][0]*b[0]+a[1][1]*b[1]+a[1][2]*b[2],a[2][0]*b[0]+a[2][1]*b[1]+a[2][2]*b[2]]}angular.module("qmWaveApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","rzModule"]).config(["$routeProvider",function(a){a.when("/part-box",{templateUrl:"views/partinboxeig.html",controller:"PartInBoxEigCtrl",controllerAs:"PartInBoxEig"}).when("/superposition",{templateUrl:"views/superposition.html",controller:"SuperpositionCtrl",controllerAs:"SuperpositionTime"}).when("/time-evolve",{templateUrl:"views/timeevolve.html",controller:"TimeEvolveCtrl",controllerAs:"TimeEvolve"}).when("/contact",{templateUrl:"views/contact.html"}).otherwise({redirectTo:"/part-box"})}]),angular.module("qmWaveApp").controller("HeaderCtrl",["$scope","$location",function(a,b){a.isActive=function(a){return a===b.path()}}]),angular.module("qmWaveApp").factory("Wavefunction",["$rootScope","Timer",function(a,b){function c(c,d,e,f,g){this._x=c,this.y0=d,this.z0=e,this._y=d.slice(0),this._z=e.slice(0),this.number=g,this.energy=f,this.wavefunction,this.initPhase=0,this.mag=100,this.update=!0;var h=this;a.$watchCollection(function(){return[b.time,h.initPhase,h.mag]},function(a,b){h.timeEvolve(),h.update=!h.update})}function d(c){this.eigenList=[],this._x=c,this._y=new Array(c.length),this._z=new Array(c.length),this.update=!0;var d,e=this;a.$watchCollection(function(){d=[b.time];for(var a=0;a<e.eigenList.length;a++)d.push(e.eigenList[a].initPhase,e.eigenList[a].mag);return d},function(a,b){e.timeEvolve(),e.update=!e.update})}function e(c){this.eigenList=c.eigenList,this._x=c._x,this.superY=c._y,this.superZ=c._z,this._y=[],this._z=[],this.update=!0;for(var d=this._x.length,e=0;d>e;e++)this._z[e]=0;var f,g=this;a.$watchCollection(function(){f=[b.time];for(var a=0;a<g.eigenList.length;a++)f.push(g.eigenList[a].initPhase,g.eigenList[a].mag);return f},function(a,b){g.timeEvolve(),g.update=!g.update})}return c.prototype.getVectors=function(){return[this._x,this._y,this._z]},c.prototype.timeEvolve=function(){var a=this.initPhase*Math.PI/180+this.energy*b.time/200;this.re_proj=Math.cos(a),this.im_proj=-Math.sin(a);for(var c=this._x.length,d=0;c>d;d++)this._y[d]=this.mag/100*(this.re_proj*this.y0[d]+this.im_proj*this.z0[d]),this._z[d]=this.mag/100*(this.im_proj*this.y0[d]-this.re_proj*this.z0[d])},c.prototype.getModulus=function(){if(angular.isDefined(this.modulus))return this.modulus;var a=new d(this._x);return a.addState(this),this.modulus=new e(a),this.modulus},c.prototype.renormalize=function(){for(var a=this.wavefunction.eigenList,b=0;b<a.length&&a[b]!=this;b++);this.wavefunction.normalize(b)},d.prototype.addState=function(a){a.wavefunction=this,this.eigenList.push(a)},d.prototype.getVectors=function(){return[this._x,this._y,this._z]},d.prototype.timeEvolve=function(){for(var a=this._x.length,b=this.eigenList.length,c=0;a>c;c++){this._y[c]=0,this._z[c]=0;for(var d=0;b>d;d++)this._y[c]+=this.eigenList[d]._y[c],this._z[c]+=this.eigenList[d]._z[c]}},d.prototype.normalize=function(a){var b=0,c=1;if(void 0==a)for(var d=0;d<this.eigenList.length;d++)b+=Math.pow(this.eigenList[d].mag/100,2);else for(var d=0;d<this.eigenList.length;d++)d==a?c-=Math.pow(this.eigenList[d].mag/100,2):b+=Math.pow(this.eigenList[d].mag/100,2);for(var e=Math.sqrt(c/b),f=0;f<this.eigenList.length;f++)if(f!=a)if(0==b){var g=e*this.eigenList[f].mag;this.eigenList[f].mag=c/(this.eigenList.length-1)}else{var g=e*this.eigenList[f].mag;this.eigenList[f].mag=g}},e.prototype.getVectors=function(){return[this._x,this._y,this._z]},e.prototype.timeEvolve=function(){for(var a=this._x.length,b=0;a>b;b++)this._y[b]=Math.sqrt(Math.pow(this.superY[b],2)+Math.pow(this.superZ[b],2))},{Eigenstate:c,Wavefunction:d,Modulus:e}}]),angular.module("qmWaveApp").factory("Timer",["$interval",function(a){var b,c={time:0,paused:!0},d=function(){angular.isDefined(b)||(b=a(function(){c.time+=.3},15),c.paused=!1)},e=function(){angular.isDefined(b)&&(a.cancel(b),b=void 0),c.paused=!0},f=function(){return angular.isDefined(b)?(e(),c.paused=!0):(d(),c.paused=!1),c.paused};return c.start=d,c.stop=e,c.toggle=f,c}]),angular.module("qmWaveApp").service("PartInBox",["Wavefunction","Plot",function(a,b){for(var c=60,d=3,e=[],f=b.axisWidth,g=[],h=0;c>=h;h++)e[h]=-f/2+h*f/c;for(var i=new a.Wavefunction(e),h=0;d>h;h++){var j=Math.pow(h+1,2),k=makeStationaryPinBox(e,h+1),l=new a.Eigenstate(e,k[0],k[1],j,h+1),m=new a.Eigenstate(e,k[0],k[1],j,h+1);i.addState(l),g.push(m)}i.normalize();var n=new a.Modulus(i);return{eigenstates:g,superposition:i,modulus:n}}]),angular.module("qmWaveApp").service("Plot",["$rootScope","Colorwheel","Timer",function(a,b,c){this.canvasWidth=230,this.canvasHeight=150,this.xOrigin=this.canvasWidth/2,this.yOrigin=this.canvasHeight/2,this.phaseOriginX=40,this.phaseOriginY=40,this.phaseRadius=35,this.axisWidth=200,this.theta=0,this.phi=-0,this.pitch=0,this.yaw=0;var d=[1,0,0],e=[0,1,0],f=[0,0,1];this.rotatedFrame=[d,e,f];var g=this;a.$watchCollection(function(){return[g.pitch,g.yaw]},function(a,b){var c=rot_mat_angle(1,0,0,g.pitch),d=apply_mat(c,g.rotatedFrame[2]),e=apply_mat(c,g.rotatedFrame[1]),f=apply_mat(c,g.rotatedFrame[0]),c=rot_mat_angle(g.rotatedFrame[1][0],g.rotatedFrame[1][1],g.rotatedFrame[1][2],g.yaw),d=apply_mat(c,d),e=apply_mat(c,e),f=apply_mat(c,f);g.rotatedFrame=[f,e,d],g.theta=Math.acos(d[2]),g.phi=Math.atan2(d[1],d[0])}),this.drawAxis=function(a){var b=-this.axisWidth/2,c=this.axisWidth/2,d=-50,e=50,f=-50,g=50,h=this.coord2plot(b,0,0),i=this.coord2plot(c,0,0);drawPath(a,h[0],h[1],i[0],i[1]),h=this.coord2plot(0,d,0),i=this.coord2plot(0,e,0),drawPath(a,h[0],h[1],i[0],i[1]),h=this.coord2plot(0,0,f),i=this.coord2plot(0,0,g),drawPath(a,h[0],h[1],i[0],i[1])},this.drawSingleFcn=function(a,c,d){var e,f,g,h,i,j,k,l,m=c[0],n=c[1],o=c[2],p=m.length;a.strokeStyle="#000000";for(var q=0;p>q;q++)e=m[q],f=n[q],g=o[q],h=this.coord2plot(e,f,g),Math.round(q)%3==0?(j=Math.PI+Math.atan2(-g,-f),k="off"==d?"#000000":b.getColor(j),0!==q?(a.lineTo(h[0],h[1]),k!==l&&(a.stroke(),a.closePath(),a.beginPath(),a.strokeStyle=k,a.moveTo(h[0],h[1]))):(a.beginPath(),a.strokeStyle=k,a.moveTo(h[0],h[1])),i=this.coord2plot(e,0,0),a.lineTo(i[0],i[1]),a.moveTo(h[0],h[1]),l=k):a.lineTo(h[0],h[1]);a.stroke(),a.closePath(),a.strokeStyle="#000000"},this.coord2plot=function(a,b,c){var d=this.rotatedFrame[0],e=this.rotatedFrame[1],f=this.rotatedFrame[2],g=rotation(this.theta,this.phi,a,b,c),g=[a,b,c],h=this.xOrigin+g[0]*d[0]+g[1]*e[0]+g[2]*f[0],i=this.yOrigin-(g[0]*d[1]+g[1]*e[1]+g[2]*f[1]),j=g[0]*d[2]+g[1]*e[2]+g[2]*f[2];return[h,i,j]},this.animList=[],this.initPhase=function(b,d){var e=b.set(),f=b.set();e.push(b.circle(this.phaseOriginX,this.phaseOriginY,this.phaseRadius)),e.push(b.path("M"+[this.phaseOriginX,this.phaseOriginY+this.phaseRadius]+"L"+[this.phaseOriginX,this.phaseOriginY-this.phaseRadius]+"Z")),e.push(b.path("M"+[this.phaseOriginX+this.phaseRadius,this.phaseOriginY]+"L"+[this.phaseOriginX-this.phaseRadius,this.phaseOriginY]+"Z")),e.attr({stroke:"#c2bcb5","stroke-width":"1"});var g=b.path("M"+[this.phaseOriginX,this.phaseOriginY]+"L"+[this.phaseOriginX,this.phaseOriginY-this.phaseRadius]+"Z");g.attr({stroke:"black","stroke-width":"2"});var h=b.circle(this.phaseOriginX,this.phaseOriginY-this.phaseRadius,3);h.attr({stroke:"black","stroke-width":"1",fill:"orange"}),f.push(g),f.push(h);var i=Raphael.animation({transform:"r-360,"+[this.phaseOriginX,this.phaseOriginY]},5e3).repeat(1/0);f.animate(i),a.$watch(function(){return c.paused},function(a,b){1==a?(console.log("pausing"),f.pause(i)):(console.log("resuming"),f.resume())})}}]),angular.module("qmWaveApp").service("Colorwheel",function(){this.colors=["#182226","#182226","#182327","#18252a","#19272d","#1a2a30","#1c2d35","#1d313a","#1f3540","#213a46","#233e4d","#254355","#27475d","#294c65","#2b506e","#2e5476","#30577f","#325b88","#345d90","#366099","#3861a1","#3a63a9","#3c63b1","#3e64b8","#4064be","#4363c4","#4563c9","#4762ce","#4a61d1","#4c5fd4","#4f5ed7","#515dd8","#535cd8","#565ad8","#5859d7","#5b5ad4","#605cd1","#635dce","#665fc9","#6960c4","#6a60be","#6a60b8","#6a60b1","#695fa9","#675ea1","#645c99","#615a90","#5c5788","#58547f","#535076","#4d4c6e","#474865","#43445d","#3e4155","#393d4d","#343946","#2f3540","#2b313a","#262d35","#232a30","#1f272d","#1d252a","#1b2327","#192226"],this.numColors=this.colors.length,this.getColor=function(a){var b=Math.round(a/(2*Math.PI)*this.numColors);return this.colors[b]}}),angular.module("qmWaveApp").controller("MainCtrl",["$scope","Timer",function(a,b){b.start(),a.Timer=b}]),angular.module("qmWaveApp").controller("PartInBoxEigCtrl",["$scope","PartInBox","Plot",function(a,b,c){c.pitch=0,c.yaw=0,a.eigenstates=b.eigenstates,a.superposition=b.superposition,a.modulus=b.modulus,setTimeout(function(){MathJax.Hub.Queue(["Typeset",MathJax.Hub])})}]),angular.module("qmWaveApp").controller("SuperpositionCtrl",["PartInBox","Timer","$scope",function(a,b,c){c.eigenstates=a.superposition.eigenList,c.superposition=a.superposition,c.modulus=a.modulus,c.buttonText="Start Time Evolution",c.timeButton=function(){var a=b.toggle();a?c.buttonText="Resume Time":c.buttonText="Pause Time"}}]),angular.module("qmWaveApp").controller("TimeEvolveCtrl",["PartInBox","Timer","$scope",function(a,b,c){c.eigenstates=a.eigenstates,c.superposition=a.superposition,c.modulus=a.modulus,c.buttonText="Start Time Evolution",c.timeButton=function(){var a=b.toggle();a?c.buttonText="Resume Time":c.buttonText="Pause Time"}}]),angular.module("qmWaveApp").directive("canvasPlot",["Timer","Plot",function(a,b){return{templateUrl:"views/canvasplot.html",restrict:"E",scope:{wave:"=",colorOption:"="},link:function(c,d,e){var f=d.children()[0].getContext("2d");f.lineWidth=2.5;var g=function(){if(f.clearRect(0,0,b.canvasWidth,b.canvasHeight),b.drawAxis(f),c.wave.constructor==Array)for(var a=0;a<c.wave.length;a++){var d=c.wave[a].getVectors();b.drawSingleFcn(f,d,c.colorOption)}else{var d=c.wave.getVectors();b.drawSingleFcn(f,d,c.colorOption)}};g();var h;c.$watchCollection(function(){if(h=[a.time,b.pitch,b.yaw],c.wave.constructor==Array)for(var d=0;d<c.wave.length;d++)h.push(c.wave[d].update);else h.push(c.wave.update);return h},function(a,b){g()})}}}]),angular.module("qmWaveApp").directive("perspective",["Plot",function(a){return{link:function(b,c,d){function e(c){j=c.pageY-h,i=c.pageX-g,g=c.pageX,h=c.pageY,b.$apply(function(){a.pitch=j/300,a.yaw=i/300})}function f(){c.off("mousemove",e),c.off("mouseup",f)}var g=0,h=0,i=0,j=0;c.on("mousedown",function(a){a.preventDefault(),g=a.pageX,h=a.pageY,c.on("mousemove",e),c.on("mouseup",f),c.on("mouseleave",f)})}}}]),angular.module("qmWaveApp").directive("phasePlot",["$rootScope","Timer","Plot",function(a,b,c){return{templateUrl:"views/phaseplot.html",restrict:"E",scope:{wave:"="},link:function(b,c,d){var e=45,f=30,g=b.wave,h=c.children()[0];makePhaseAxis(h,e,f);var i=d3.select(h).append("line");i.attr("stroke","grey"),i.attr("x1",e),i.attr("y1",e),i.attr("x2",e),i.attr("y2",e);var j=d3.select(h).append("circle");j.attr("cx",e),j.attr("cy",e),j.attr("r",3),j.attr("stroke","grey"),j.attr("fill","orange"),a.$watchCollection(function(){return[g.re_proj,g.im_proj]},function(a,b){i.attr("x2",e-g.im_proj*f).attr("y2",e-g.re_proj*f),j.attr("cx",e-g.im_proj*f).attr("cy",e-g.re_proj*f)})}}}]);var makePhaseAxis=function(a,b,c){d3.select(a).append("circle").attr("stroke","grey").attr("fill","none").attr("cx",b).attr("cy",b).attr("r",c),d3.select(a).append("line").attr("stroke","grey").attr("stroke-width",1).attr("x1",b).attr("x2",b).attr("y1",b-c).attr("y2",b+c),d3.select(a).append("line").attr("stroke","grey").attr("stroke-width",1).attr("y1",b).attr("y2",b).attr("x1",b-c).attr("x2",b+c),d3.select(a).append("text").attr("stroke","grey").attr("font","Georgia").attr("x",b-3).attr("y",b-(c+5)).attr("font-size",13).text(1),d3.select(a).append("text").attr("stroke","grey").attr("font","Georgia").attr("x",b-7).attr("y",b+(c+12)).attr("font-size",13).text(-1),d3.select(a).append("text").attr("stroke","grey").attr("font","Georgia").attr("x",b+(c+4)).attr("y",b+2).attr("font-size",13).text("i"),d3.select(a).append("text").attr("stroke","grey").attr("font","Georgia").attr("x",b-(c+12)).attr("y",b+2).attr("font-size",13).text("-i")};angular.module("qmWaveApp").directive("phaseSlider",function(){return{templateUrl:"views/phaseslider.html",restrict:"E",scope:{wave:"="},link:function(a,b,c){a.wave;a.slider={options:{floor:0,ceil:360,translate:function(a){return a+"°"}}}}}}),angular.module("qmWaveApp").directive("math",function(){return{restrict:"EA",link:function(a,b,c){setTimeout(function(){MathJax.Hub.Queue(["Typeset",MathJax.Hub])})}}}),angular.module("qmWaveApp").directive("magnitudeSlider",function(){return{templateUrl:"views/magnitudeslider.html",restrict:"E",scope:{wave:"=",normalize:"="},link:function(a,b,c){a.wave;a.slider={options:{floor:0,ceil:100,step:1,translate:function(a){return a/100},onChange:function(){a.wave.renormalize()}}}}}}),angular.module("qmWaveApp").run(["$templateCache",function(a){a.put("views/canvasplot.html",'<canvas width="230px" height="150px"> </canvas>'),a.put("views/contact.html","<span>email: donghyun208</span> <span>at gmail.com</span>"),a.put("views/magnitudeslider.html",'<rzslider rz-slider-model="wave.mag" rz-slider-options="slider.options"></rzslider>'),a.put("views/main.html",'<!-- <div class="jumbotron">\n  <h1>\'Allo, \'Allo!</h1>\n  <p class="lead">\n    <img src="images/yeoman.8cb970fb.png" alt="I\'m Yeoman"><br>\n    Always a pleasure scaffolding your apps.\n  </p>\n  <p><a class="btn btn-lg btn-success" ng-href="#/">Splendid!<span class="glyphicon glyphicon-ok"></span></a></p>\n</div>\n\n<div class="row marketing">\n  <h4>HTML5 Boilerplate</h4>\n  <p>\n    HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.\n  </p>\n\n  <h4>Angular</h4>\n  <p>\n    AngularJS is a toolset for building the framework most suited to your application development.\n  </p>\n\n  <h4>Karma</h4>\n  <p>Spectacular Test Runner for JavaScript.</p>\n</div>\n{{Timer.time}}\n -->'),a.put("views/partinboxeig.html",'<math>\n<h2>\n1D Particle in an Infinite Potential Well\n</h2>\n\nThe 1 dimensional particle in a box problem consists of a single particle described by the potential:\n$$V(x)=\\left\\{\n     \\begin{array}{lr}\n       0: &  0 < x < l\\\\\n       \\infty: & \\mathrm{elsewhere}\n     \\end{array}\n   \\right.\\\\$$\nThis particle is subject to an infintely high potential in the regions outside of the box, such that we can be sure the particle will never be found outside of this box.\n<br>\n<br>\n<br>\n<br>\n<h3>\nSolution:\n</h3>\nWe need to first define the Hamiltonian for this problem. The Hamiltonian for a single particle in 1 dimension is:\n$$\n\\hat{H} = -\\frac{\\hbar^2}{2m}\\frac{\\mathrm{d}^2}{\\mathrm{d}x^2} + V(x)\n$$\n\nSince the probability of finding the particle outside of the box is zero, this means that $|\\psi(x)|^2$ will be zero outside of the box (and also at its edges). Therefore, we can simplify our problem by only considering $\\psi(x)$ between $0\\leq x \\leq l$, setting $V(x) = 0$, and enforcing the following boundary conditions:\n\n$$\\psi(0)=0, \\qquad \\psi(l) = 0$$\n\nNext, we solve the Time Independent Schrodinger Equation for this problem, which requires that we find the eigenvalues and eigenvectors of $\\hat{H}$. We will call the eigenvalues \'$E$\'.\n\n$$\n\\begin{align}\n\\hat{H}\\psi(x) &= E\\psi(x)\\\\\n-\\frac{\\hbar^2}{2m}\\frac{\\mathrm{d}^2}{\\mathrm{d}x^2}\\psi(x) &= E\\psi(x)\\\\\n\\frac{\\mathrm{d}^2}{\\mathrm{d}x^2}\\psi(x) &= -\\frac{2mE}{\\hbar^2}\\psi(x)\n\\end{align}\n$$\n\nsolving the differential equation above, we get:\n\n$$\n\\begin{align}\n\\psi(x) &= A\\sin\\left(\\frac{\\sqrt{2mE}}{\\hbar} x\\right) + B\\cos\\left(\\frac{\\sqrt{2mE}}{\\hbar} x\\right)\n\\end{align}\n$$\n\n<br>\n<br>\nWe apply the first boundary condition $\\psi(0)=0$ and find that $B$ must be $0$.\n\n$$\n\\begin{align}\n\\psi(x) &= A\\sin\\left(\\frac{\\sqrt{2mE}}{\\hbar} x\\right)\n\\end{align}\n$$\n\n<br>\nNext, we use the second boundary condition $\\psi(l)=0$.\n$$\n\\begin{align}\n\\psi(l) &= A\\sin\\left(\\frac{\\sqrt{2mE}}{\\hbar}l\\right)\\\\\n0 &= A\\sin\\left(\\frac{\\sqrt{2mE}}{\\hbar}l\\right)\\\\\n\\end{align}\n$$\nIn order for our equation to satisfy the boundary condition $\\psi(l)=0$, either $A=0$ (yielding a trivial solution), or the expression inside the sine function must be an integer multiple of $\\pi$\n\n$$\n\\frac{\\sqrt{2mE}}{\\hbar} l = n \\pi\\\\\nE = \\frac{\\hbar^2 \\pi^2 n^2}{2ml^2}\n$$\n<p class="center-block">\nNow we have our eigenvalues $E$ (indexed by $n$), and eigenfunctions $\\psi_n(x)$, for integer values of $n$\n</p>\n$$\n\\begin{align}\n\\psi_n(x) &= A\\sin\\left(\\frac{\\sqrt{2mE_n}}{\\hbar} x\\right) & E_n &= \\frac{\\hbar^2 \\pi^2 n^2}{2ml^2}\n\\end{align}\n$$\n\nThere are an infinite number of eigenvalues, one for every integer value of $n$. Note that $n=0$ again yields a trivial solution, and that a negative value of $n$ yields the same eigenvalue as a positive value of $n$. Therefore, we\'ll choose a convention where we only consider the positive integers of $n$ ($n=1,2,3...$)\n<br>\n<br>\n<br>\n\n<h3>\nInterpretation:\n</h3>\nThe eigenvalues correspond to the possible energies that can be measured. The lowest possible energy is when $n=1$, and is called the ground state.\n\n<br>\n<br>\n<br>\n<br>\n\n<h4>\nEigenstates:\n</h4>\n<div ng-repeat="state in eigenstates" class="col-md-4">\n    <p class="text-center">\n        $\\psi_{{state.number}}(x)$\n    </p>\n    <canvas-plot wave="state" colorOption="\'off\'"></canvas-plot>\n</div>\n<br>\n<h4>\nProbability Density:\n</h4>\n<div ng-repeat="state in eigenstates" class="col-md-4">\n    <p class="text-center">\n        $|\\psi_{{state.number}}(x)|^2$\n    </p>\n    <canvas-plot wave="state.getModulus()" colorOption="\'off\'"></canvas-plot>\n</div>\n<br>\n</math>\n'),a.put("views/phaseplot.html",'<svg width="90" height="90" style="display:block; margin-left:auto; margin-right:auto"> </svg>'),a.put("views/phaseslider.html",'<rzslider rz-slider-model="wave.initPhase" rz-slider-options="slider.options"></rzslider>'),a.put("views/superposition.html",'<div math> <h2> Superposition States: </h2> One of the postulates of quantum mechanics is that any superposition of eigenstates is an allowable wavefunction. Superposition states are linear combinations of eigenstates of the form: <div style="font-size: 133%"> $$ \\Psi(x) = c_1 \\psi_1(x) + c_2 \\psi_2(x) + c_3 \\psi_3(x) $$ </div> We will use $\\Psi$ to denote a general state, and $\\psi_n$ to denote the $n^{th}$ eigenstate. In general, the summation of states can run to infinity, but for now we will only consider superpositions constructed using the first three eigenstates. <br> <br> <br> <h4> Complex Plane </h4> The coefficients $c_n$ can be complex numbers <h4> Normalization Principle </h4> The coefficients $c_n$ must also satisfy the normalization constraint. <br> <br> <br> <br> <br> <br> <button ng-click="timeButton()" class="btn btn-primary"> {{buttonText}} </button> <p>Eigenstates</p> <div ng-repeat="state in eigenstates" class="col-md-4"> <span perspective> <p class="text-center"> $\\psi_{{state.number}}$ </p> <div class="center-block"> <phase-plot wave="state"></phase-plot> </div> <canvas-plot wave="state"></canvas-plot> </span> <div class="center-block"> <label>Initial Phase </label> <phase-slider wave="state"></phase-slider> <br> <br> <label>Magnitude </label> <magnitude-slider wave="state"> </magnitude-slider></div> </div> <span perspective> <div class="col-md-4"> <p>Superimposed Eigenstates</p> <canvas-plot wave="eigenstates"></canvas-plot> </div> <div class="col-md-4"> <p>Superposition</p> <canvas-plot wave="superposition"></canvas-plot> </div> <div class="col-md-4"> <p>Probability Density</p> <canvas-plot wave="modulus"></canvas-plot> </div> </span> </div>'),a.put("views/timeevolve.html",'<div math> <h2> Time Evolution </h2> <br> The equation that governs time evolution in quantum mechanics is the Time Dependent Schrodinger Equation: $$ i\\hbar\\frac{\\partial}{\\partial t} \\Psi(r,t) = \\hat{H}\\Psi(r,t) $$ For time-independent Hamiltonians, the general solution is given as: <!-- $$\n\\begin{align}\ni\\hbar\\frac{\\partial}{\\partial t} \\Psi(r,t) &= \\hat{H}\\Psi(r,t)\\\\\n\\frac{\\partial}{\\partial t} \\Psi(r,t) &= -\\frac{i}{\\hbar}\\hat{H}\\Psi(r,t)\n\\end{align}\n$$\n --> $$ \\Psi(r,t) = e^{-\\frac{i}{\\hbar}\\hat{H}t}\\Psi(r,0)\\\\ $$ where $\\Psi(r,0)$ is the initial condition. This means if we know $\\Psi(r,0)$, the state of our system at time $t=0$, and we know the Hamiltonian, we can know what the state of the system at any future time as well. <br> <br> <br> <h3> Evolution of Particle in a Box Eigenstates </h3> <button ng-click="timeButton()" class="btn btn-primary"> {{buttonText}} </button> <p>Eigenstates</p> <span perspective> <div ng-repeat="state in eigenstates" class="col-md-4"> <p class="text-center"> $\\psi_{{state.number}}$ </p> <div class="center-block"> <phase-plot wave="state"></phase-plot> </div> <canvas-plot wave="state"></canvas-plot> <div class="center-block"> <label>Initial Phase </label> <phase-slider wave="state"></phase-slider> <label>Magnitude </label> <input class="form-control" id="magnitude" ng-model="state.mag" placeholder="magnitude"> </div> </div> </span> <span perspective> <div class="col-md-4"> <p>Superimposed Eigenstates</p> <canvas-plot wave="eigenstates"></canvas-plot> </div> <div class="col-md-4"> <p>Superposition</p> <canvas-plot wave="superposition"></canvas-plot> </div> <div class="col-md-4"> <p>Probability Density</p> <canvas-plot wave="modulus"></canvas-plot> </div> </span> </div>')}]);