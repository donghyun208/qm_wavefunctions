"use strict";function makeStationaryPinBox(a,b){for(var c,d=30,e=[],f=[],g=a[a.length-1]-a[0],h=a.length,i=0;h>i;i++)c=a[i],e[i]=d*Math.sin(b*(Math.PI/g*c+Math.PI/2)),f[i]=0;return[e,f]}function rotation(a,b,c,d,e){var f=Math.cos(a),g=Math.sin(a),h=Math.cos(b),i=Math.sin(b),j=c*f*h-d*i+e*g*h,k=c*f*i+d*h+e*g*i,l=-c*g+e*f;return[j,k,l]}function drawPath(a,b,c,d,e){a.beginPath(),a.moveTo(b,c),a.lineTo(d,e),a.stroke(),a.closePath()}function rot_mat_angle(a,b,c,d){var e=Math.cos(d),f=Math.sin(d),g=Math.sqrt(Math.pow(a,2)+Math.pow(b,2)+Math.pow(c,2)),h=a/g,i=b/g,j=c/g;return[[e+Math.pow(h,2)*(1-e),h*i*(1-e)-j*f,h*j*(1-e)+i*f],[i*h*(1-e)+j*f,e+Math.pow(i,2)*(1-e),i*j*(1-e)-h*f],[j*h*(1-e)-i*f,j*i*(1-e)+h*f,e+Math.pow(j,2)*(1-e)]]}function apply_mat(a,b){return[a[0][0]*b[0]+a[0][1]*b[1]+a[0][2]*b[2],a[1][0]*b[0]+a[1][1]*b[1]+a[1][2]*b[2],a[2][0]*b[0]+a[2][1]*b[1]+a[2][2]*b[2]]}angular.module("qmWaveApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","rzModule"]).config(["$routeProvider",function(a){a.when("/part-box",{templateUrl:"views/partinboxeig.html",controller:"PartInBoxEigCtrl",controllerAs:"PartInBoxEig"}).when("/superposition",{templateUrl:"views/superposition.html",controller:"SuperpositionCtrl",controllerAs:"SuperpositionTime"}).when("/time-evolve",{templateUrl:"views/timeevolve.html",controller:"TimeEvolveCtrl",controllerAs:"TimeEvolve"}).when("/contact",{templateUrl:"views/contact.html"}).otherwise({redirectTo:"/part-box"})}]),angular.module("qmWaveApp").controller("HeaderCtrl",["$scope","$location",function(a,b){a.isActive=function(a){return a===b.path()}}]),angular.module("qmWaveApp").factory("Wavefunction",["$rootScope","Timer",function(a,b){function c(c,d,e,f,g){this._x=c,this.y0=d,this.z0=e,this._y=d.slice(0),this._z=e.slice(0),this.number=g,this.energy=f,this.wavefunction,this.currPhase=0,this.initPhase=0,this.mag=100,this.update=1;var h=this;a.$watchCollection(function(){return[b.time,h.initPhase,h.mag]},function(a,b){h.timeEvolve()})}function d(c){this.eigenList=[],this._x=c,this._y=new Array(c.length),this._z=new Array(c.length),this.update=1;var d,e=this;a.$watchCollection(function(){d=[b.time];for(var a=0;a<e.eigenList.length;a++)d.push(e.eigenList[a].initPhase,e.eigenList[a].mag);return d},function(a,b){setTimeout(function(){e.timeEvolve()})})}function e(c){this.eigenList=c.eigenList,this._x=c._x,this.superY=c._y,this.superZ=c._z,this._y=[],this._z=[],this.update=1;for(var d=this._x.length,e=0;d>e;e++)this._z[e]=0;var f,g=this;a.$watchCollection(function(){f=[b.time];for(var a=0;a<g.eigenList.length;a++)f.push(g.eigenList[a].initPhase,g.eigenList[a].mag);return f},function(b,c){setTimeout(function(){g.timeEvolve(),a.$digest()})})}return a.Math=window.Math,c.prototype.getVectors=function(){return[this._x,this._y,this._z]},c.prototype.timeEvolve=function(){this.currPhase=this.initPhase*Math.PI/180+this.energy*b.time/50,this.re_proj=Math.cos(this.currPhase),this.im_proj=-Math.sin(this.currPhase);for(var a=this._x.length,c=0;a>c;c++)this._y[c]=this.mag/100*(this.re_proj*this.y0[c]+this.im_proj*this.z0[c]),this._z[c]=this.mag/100*(this.im_proj*this.y0[c]-this.re_proj*this.z0[c]);this.update+=1},c.prototype.getModulus=function(){if(angular.isDefined(this.modulus))return this.modulus;var a=new d(this._x);return a.addState(this),this.modulus=new e(a),this.modulus},c.prototype.renormalize=function(){for(var a=this.wavefunction.eigenList,b=0;b<a.length&&a[b]!=this;b++);this.wavefunction.normalize(b)},d.prototype.addState=function(a){a.wavefunction=this,this.eigenList.push(a)},d.prototype.getVectors=function(){return[this._x,this._y,this._z]},d.prototype.timeEvolve=function(){for(var a=this._x.length,b=this.eigenList.length,c=0;a>c;c++){this._y[c]=0,this._z[c]=0;for(var d=0;b>d;d++)this._y[c]+=this.eigenList[d]._y[c],this._z[c]+=this.eigenList[d]._z[c]}this.update+=1},d.prototype.normalize=function(b){var c=0,d=1;if(void 0==b)for(var e=0;e<this.eigenList.length;e++)c+=Math.pow(this.eigenList[e].mag/100,2);else for(var e=0;e<this.eigenList.length;e++)e==b?d-=Math.pow(this.eigenList[e].mag/100,2):c+=Math.pow(this.eigenList[e].mag/100,2);for(var f=Math.sqrt(d/c),g=0;g<this.eigenList.length;g++)if(g!=b)if(0==c){var h=f*this.eigenList[g].mag;this.eigenList[g].mag=Math.round(d/(this.eigenList.length-1)*100)}else{var h=f*this.eigenList[g].mag;this.eigenList[g].mag=Math.round(h)}var i=this;setTimeout(function(){i.timeEvolve(),a.$digest()})},e.prototype.getVectors=function(){return[this._x,this._y,this._z]},e.prototype.timeEvolve=function(){for(var a=this._x.length,b=0;a>b;b++)this._y[b]=Math.sqrt(Math.pow(this.superY[b],2)+Math.pow(this.superZ[b],2));this.update+=1},{Eigenstate:c,Wavefunction:d,Modulus:e}}]),angular.module("qmWaveApp").factory("Timer",["$interval",function(a){var b,c={time:0,paused:!0},d=function(){angular.isDefined(b)||(b=a(function(){c.time+=.075},15),c.paused=!1)},e=function(){angular.isDefined(b)&&(a.cancel(b),b=void 0),c.paused=!0},f=function(){return angular.isDefined(b)?(e(),c.paused=!0):(d(),c.paused=!1),c.paused};return c.start=d,c.stop=e,c.toggle=f,c}]),angular.module("qmWaveApp").service("PartInBox",["Wavefunction","Plot",function(a,b){for(var c=60,d=3,e=[],f=b.axisWidth,g=[],h=0;c>=h;h++)e[h]=-f/2+h*f/c;for(var i=new a.Wavefunction(e),h=0;d>h;h++){var j=Math.pow(h+1,2),k=makeStationaryPinBox(e,h+1),l=new a.Eigenstate(e,k[0],k[1],j,h+1),m=new a.Eigenstate(e,k[0],k[1],j,h+1);i.addState(l),g.push(m)}i.normalize();var n=new a.Modulus(i);return{eigenstates:g,superposition:i,modulus:n}}]),angular.module("qmWaveApp").service("Plot",["$rootScope","Colorwheel","Timer",function(a,b,c){this.canvasWidth=230,this.canvasHeight=150,this.xOrigin=this.canvasWidth/2,this.yOrigin=this.canvasHeight/2,this.phaseOriginX=40,this.phaseOriginY=40,this.phaseRadius=35,this.axisWidth=200,this.theta=0,this.phi=-0,this.pitch=0,this.yaw=0;var d=[1,0,0],e=[0,1,0],f=[0,0,1];this.rotatedFrame=[d,e,f];var g=this;a.$watchCollection(function(){return[g.pitch,g.yaw]},function(a,b){var c=rot_mat_angle(1,0,0,g.pitch),d=apply_mat(c,g.rotatedFrame[2]),e=apply_mat(c,g.rotatedFrame[1]),f=apply_mat(c,g.rotatedFrame[0]),c=rot_mat_angle(g.rotatedFrame[1][0],g.rotatedFrame[1][1],g.rotatedFrame[1][2],g.yaw),d=apply_mat(c,d),e=apply_mat(c,e),f=apply_mat(c,f);g.rotatedFrame=[f,e,d],g.theta=Math.acos(d[2]),g.phi=Math.atan2(d[1],d[0])}),this.drawAxis=function(a){var b=-this.axisWidth/2,c=this.axisWidth/2,d=-50,e=50,f=-50,g=50,h=this.coord2plot(b,0,0),i=this.coord2plot(c,0,0);drawPath(a,h[0],h[1],i[0],i[1]),h=this.coord2plot(0,d,0),i=this.coord2plot(0,e,0),drawPath(a,h[0],h[1],i[0],i[1]),h=this.coord2plot(0,0,f),i=this.coord2plot(0,0,g),drawPath(a,h[0],h[1],i[0],i[1])},this.drawSingleFcn=function(a,c,d){var e,f,g,h,i,j,k,l,m=c[0],n=c[1],o=c[2],p=m.length;a.strokeStyle="#000000";for(var q=0;p>q;q++)e=m[q],f=n[q],g=o[q],h=this.coord2plot(e,f,g),Math.round(q)%3==0?(j=Math.PI+Math.atan2(-g,-f),k="off"==d?"#000000":b.getColor(j),0!==q?(a.lineTo(h[0],h[1]),k!==l&&(a.stroke(),a.closePath(),a.beginPath(),a.strokeStyle=k,a.moveTo(h[0],h[1]))):(a.beginPath(),a.strokeStyle=k,a.moveTo(h[0],h[1])),i=this.coord2plot(e,0,0),a.lineTo(i[0],i[1]),a.moveTo(h[0],h[1]),l=k):a.lineTo(h[0],h[1]);a.stroke(),a.closePath(),a.strokeStyle="#000000"},this.coord2plot=function(a,b,c){var d=this.rotatedFrame[0],e=this.rotatedFrame[1],f=this.rotatedFrame[2],g=rotation(this.theta,this.phi,a,b,c),g=[a,b,c],h=this.xOrigin+g[0]*d[0]+g[1]*e[0]+g[2]*f[0],i=this.yOrigin-(g[0]*d[1]+g[1]*e[1]+g[2]*f[1]),j=g[0]*d[2]+g[1]*e[2]+g[2]*f[2];return[h,i,j]},this.animList=[],this.initPhase=function(b,d){var e=b.set(),f=b.set();e.push(b.circle(this.phaseOriginX,this.phaseOriginY,this.phaseRadius)),e.push(b.path("M"+[this.phaseOriginX,this.phaseOriginY+this.phaseRadius]+"L"+[this.phaseOriginX,this.phaseOriginY-this.phaseRadius]+"Z")),e.push(b.path("M"+[this.phaseOriginX+this.phaseRadius,this.phaseOriginY]+"L"+[this.phaseOriginX-this.phaseRadius,this.phaseOriginY]+"Z")),e.attr({stroke:"#c2bcb5","stroke-width":"1"});var g=b.path("M"+[this.phaseOriginX,this.phaseOriginY]+"L"+[this.phaseOriginX,this.phaseOriginY-this.phaseRadius]+"Z");g.attr({stroke:"black","stroke-width":"2"});var h=b.circle(this.phaseOriginX,this.phaseOriginY-this.phaseRadius,3);h.attr({stroke:"black","stroke-width":"1",fill:"orange"}),f.push(g),f.push(h);var i=Raphael.animation({transform:"r-360,"+[this.phaseOriginX,this.phaseOriginY]},5e3).repeat(1/0);f.animate(i),a.$watch(function(){return c.paused},function(a,b){1==a?(console.log("pausing"),f.pause(i)):(console.log("resuming"),f.resume())})}}]),angular.module("qmWaveApp").service("Colorwheel",function(){this.colors=["#182226","#182226","#182327","#18252a","#19272d","#1a2a30","#1c2d35","#1d313a","#1f3540","#213a46","#233e4d","#254355","#27475d","#294c65","#2b506e","#2e5476","#30577f","#325b88","#345d90","#366099","#3861a1","#3a63a9","#3c63b1","#3e64b8","#4064be","#4363c4","#4563c9","#4762ce","#4a61d1","#4c5fd4","#4f5ed7","#515dd8","#535cd8","#565ad8","#5859d7","#5b5ad4","#605cd1","#635dce","#665fc9","#6960c4","#6a60be","#6a60b8","#6a60b1","#695fa9","#675ea1","#645c99","#615a90","#5c5788","#58547f","#535076","#4d4c6e","#474865","#43445d","#3e4155","#393d4d","#343946","#2f3540","#2b313a","#262d35","#232a30","#1f272d","#1d252a","#1b2327","#192226"],this.numColors=this.colors.length,this.getColor=function(a){var b=Math.round(a/(2*Math.PI)*this.numColors);return this.colors[b]}}),angular.module("qmWaveApp").controller("MainCtrl",["$scope","Timer",function(a,b){b.start(),a.Timer=b}]),angular.module("qmWaveApp").controller("PartInBoxEigCtrl",["$scope","PartInBox","Plot","Timer",function(a,b,c,d){c.pitch=0,c.yaw=0,d.stop(),d.time=0,a.eigenstates=b.eigenstates,a.superposition=b.superposition,a.modulus=b.modulus}]),angular.module("qmWaveApp").controller("SuperpositionCtrl",["PartInBox","Timer","$scope",function(a,b,c){b.stop(),b.time=0,c.eigenList=a.superposition.eigenList,c.superposition=a.superposition,c.modulus=a.modulus}]),angular.module("qmWaveApp").controller("TimeEvolveCtrl",["PartInBox","Timer","$scope",function(a,b,c){c.eigenstates=a.eigenstates,c.eigenList=a.superposition.eigenList,c.superposition=a.superposition,c.modulus=a.modulus,c.Timer=b,c.showResetButton=!1,c.buttonText="Start Time Evolution",c.timeButton=function(){var a=b.toggle();c.showResetButton=!0,a?c.buttonText="Resume Time":c.buttonText="Pause Time"},c.resetButton=function(){b.time=0}}]),angular.module("qmWaveApp").directive("canvasPlot",["Timer","Plot",function(a,b){return{templateUrl:"views/canvasplot.html",restrict:"E",scope:{wave:"=",colorOption:"="},link:function(c,d,e){var f=d.children()[0].getContext("2d");f.lineWidth=2.5;var g=function(){if(f.clearRect(0,0,b.canvasWidth,b.canvasHeight),b.drawAxis(f),c.wave.constructor==Array)for(var a=0;a<c.wave.length;a++){var d=c.wave[a].getVectors();b.drawSingleFcn(f,d,c.colorOption)}else{var d=c.wave.getVectors();b.drawSingleFcn(f,d,c.colorOption)}};g();var h;c.$watchCollection(function(){if(h=[b.pitch,b.yaw,a.time],c.wave.constructor==Array)for(var d=0;d<c.wave.length;d++)h.push(c.wave[d].update);else h.push(c.wave.update);return h},function(a,b){g()})}}}]),angular.module("qmWaveApp").directive("perspective",["Plot",function(a){return{link:function(b,c,d){function e(c){j=c.pageY-h,i=c.pageX-g,g=c.pageX,h=c.pageY,b.$apply(function(){a.pitch=j/300,a.yaw=i/300})}function f(){c.off("mousemove",e),c.off("mouseup",f)}var g=0,h=0,i=0,j=0;c.on("mousedown",function(a){a.preventDefault(),g=a.pageX,h=a.pageY,c.on("mousemove",e),c.on("mouseup",f),c.on("mouseleave",f)})}}}]),angular.module("qmWaveApp").directive("phasePlot",["$rootScope","Timer","Plot",function(a,b,c){return{templateUrl:"views/phaseplot.html",restrict:"E",scope:{wave:"="},link:function(b,c,d){var e=45,f=30,g=b.wave,h=c.children()[0];makePhaseAxis(h,e,f);var i=d3.select(h).append("line");i.attr("stroke","grey"),i.attr("x1",e),i.attr("y1",e),i.attr("x2",e),i.attr("y2",e);var j=d3.select(h).append("circle");j.attr("cx",e),j.attr("cy",e),j.attr("r",3),j.attr("stroke","grey"),j.attr("fill","orange"),a.$watchCollection(function(){return[g.re_proj,g.im_proj]},function(a,b){i.attr("x2",e-g.im_proj*f).attr("y2",e-g.re_proj*f),j.attr("cx",e-g.im_proj*f).attr("cy",e-g.re_proj*f)})}}}]);var makePhaseAxis=function(a,b,c){d3.select(a).append("circle").attr("stroke","grey").attr("fill","none").attr("cx",b).attr("cy",b).attr("r",c),d3.select(a).append("line").attr("stroke","grey").attr("stroke-width",1).attr("x1",b).attr("x2",b).attr("y1",b-c).attr("y2",b+c),d3.select(a).append("line").attr("stroke","grey").attr("stroke-width",1).attr("y1",b).attr("y2",b).attr("x1",b-c).attr("x2",b+c),d3.select(a).append("text").attr("stroke","grey").attr("font","Georgia").attr("x",b-3).attr("y",b-(c+5)).attr("font-size",13).text(1),d3.select(a).append("text").attr("stroke","grey").attr("font","Georgia").attr("x",b-7).attr("y",b+(c+12)).attr("font-size",13).text(-1),d3.select(a).append("text").attr("stroke","grey").attr("font","Georgia").attr("x",b+(c+4)).attr("y",b+2).attr("font-size",13).text("i"),d3.select(a).append("text").attr("stroke","grey").attr("font","Georgia").attr("x",b-(c+12)).attr("y",b+2).attr("font-size",13).text("-i")};angular.module("qmWaveApp").directive("phaseSlider",["$filter",function(a){return{templateUrl:"views/phaseslider.html",restrict:"E",scope:{wave:"="},controller:["$scope",function(b){b.color="#d19000",b.mystyles="rzslider .rz-pointer { background-color: "+b.color+"; }",b.slider={options:{floor:0,ceil:360,translate:function(b){return a("number")(b/180,1)+"π"}}}}],link:function(a,b,c){setTimeout(function(){var a=b[0].getElementsByClassName("rz-pointer")[0];a.style["background-color"]="#FFD700"})}}}]),angular.module("qmWaveApp").directive("math",function(){return{restrict:"EA",link:function(a,b,c){setTimeout(function(){MathJax.Hub.Queue(["Typeset",MathJax.Hub])})}}}),angular.module("qmWaveApp").directive("magnitudeSlider",function(){return{templateUrl:"views/magnitudeslider.html",restrict:"E",scope:{wave:"=",normalize:"="},controller:["$scope",function(a){a.color="#3f7590",a.mystyles="rzslider .rz-pointer { background-color: "+a.color+"; }",a.slider={options:{floor:0,ceil:100,step:1,translate:function(a){return a/100},onChange:function(){a.wave.renormalize()}}}}],link:function(a,b,c){setTimeout(function(){var a=b[0].getElementsByClassName("rz-pointer")[0];a.style["background-color"]="#003A70"})}}}),angular.module("qmWaveApp").directive("superposEqn",["Timer","$filter",function(a,b){return{templateUrl:"views/superposeqn.html",restrict:"E",scope:{wave:"="},link:function(b,c,d){b.Timer=a,b.tester="e^{"+b.wave.eigenList[0].currPhase+"}"}}}]),angular.module("qmWaveApp").directive("mathjaxBind",function(){return{restrict:"A",controller:["$scope","$element","$attrs",function(a,b,c){a.$watch(c.mathjaxBind,function(a){var c=angular.element("<script type='math/tex'>").html(void 0==a?"":a);b.html(""),b.append(c),MathJax.Hub.Queue(["Reprocess",MathJax.Hub,b[0]])})}]}}),angular.module("qmWaveApp").run(["$templateCache",function(a){a.put("views/canvasplot.html",'<canvas width="230px" height="150px"> </canvas>'),a.put("views/contact.html","<span>email: donghyun208</span> <span>at gmail.com</span> <br> <br> If you are a Chem 120A student and have questions, please use Piazza to contact me. <br> <br>"),a.put("views/magnitudeslider.html",'<rzslider rz-slider-model="wave.mag" rz-slider-options="slider.options"></rzslider>'),a.put("views/main.html",'<!-- <div class="jumbotron">\n  <h1>\'Allo, \'Allo!</h1>\n  <p class="lead">\n    <img src="images/yeoman.8cb970fb.png" alt="I\'m Yeoman"><br>\n    Always a pleasure scaffolding your apps.\n  </p>\n  <p><a class="btn btn-lg btn-success" ng-href="#/">Splendid!<span class="glyphicon glyphicon-ok"></span></a></p>\n</div>\n\n<div class="row marketing">\n  <h4>HTML5 Boilerplate</h4>\n  <p>\n    HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.\n  </p>\n\n  <h4>Angular</h4>\n  <p>\n    AngularJS is a toolset for building the framework most suited to your application development.\n  </p>\n\n  <h4>Karma</h4>\n  <p>Spectacular Test Runner for JavaScript.</p>\n</div>\n{{Timer.time}}\n -->'),a.put("views/partinboxeig.html",'<math>\n<h2>\n1D Particle in an Infinite Potential Well\n</h2>\n\nThe 1 dimensional particle in a box problem consists of a single particle described by the potential:\n$$V(x)=\\left\\{\n     \\begin{array}{lr}\n       0: &  0 < x < l\\\\\n       \\infty: & \\mathrm{elsewhere}\n     \\end{array}\n   \\right.\\\\$$\nThis particle is subject to an infintely high potential in the regions outside of the box, such that we can be sure the particle will never be found outside of this box.\n<br>\n<br>\n<br>\n<br>\n<h3>\nSolving the Hamiltonian:\n</h3>\nWe need to first define the Hamiltonian for this problem.\nThe Hamiltonian for a single particle in 1 dimension is:\n$$\n\\hat{H} = -\\frac{\\hbar^2}{2m}\\frac{\\mathrm{d}^2}{\\mathrm{d}x^2} + V(x)\n$$\n\nSince the probability of finding the particle outside of the box is zero, this means that $|\\psi(x)|^2$ will be zero outside of the box (and also at its edges).\nTherefore, we can simplify our problem by only considering $\\psi(x)$ between $0\\leq x \\leq l$, setting $V(x) = 0$, and enforcing the following boundary conditions:\n\n$$\\psi(0)=0, \\qquad \\psi(l) = 0$$\n\nNext, we solve the Time Independent Schrodinger Equation for this problem, which requires that we find the eigenvalues and eigenvectors of $\\hat{H}$. We will call the eigenvalues \'$E$\'.\n\n$$\n\\begin{align}\n\\hat{H}\\psi(x) &= E\\psi(x)\\\\\n-\\frac{\\hbar^2}{2m}\\frac{\\mathrm{d}^2}{\\mathrm{d}x^2}\\psi(x) &= E\\psi(x)\\\\\n\\frac{\\mathrm{d}^2}{\\mathrm{d}x^2}\\psi(x) &= -\\frac{2mE}{\\hbar^2}\\psi(x)\n\\end{align}\n$$\n\nsolving the differential equation above, we get:\n\n$$\n\\begin{align}\n\\psi(x) &= A\\sin\\left(\\frac{\\sqrt{2mE}}{\\hbar} x\\right) + B\\cos\\left(\\frac{\\sqrt{2mE}}{\\hbar} x\\right)\n\\end{align}\n$$\n\n<br>\n<br>\nWe apply the first boundary condition $\\psi(0)=0$ and find that $B$ must be $0$.\n\n$$\n\\begin{align}\n\\psi(x) &= A\\sin\\left(\\frac{\\sqrt{2mE}}{\\hbar} x\\right)\n\\end{align}\n$$\n\n<br>\nNext, we use the second boundary condition $\\psi(l)=0$.\n$$\n\\begin{align}\n\\psi(l) &= A\\sin\\left(\\frac{\\sqrt{2mE}}{\\hbar}l\\right)\\\\\n0 &= A\\sin\\left(\\frac{\\sqrt{2mE}}{\\hbar}l\\right)\\\\\n\\end{align}\n$$\nIn order for our equation to satisfy the boundary condition $\\psi(l)=0$, either $A=0$ (yielding a trivial solution), or the expression inside the sine function must be an integer multiple of $\\pi$\n\n$$\n\\frac{\\sqrt{2mE}}{\\hbar} l = n \\pi\\\\\nE = \\frac{\\hbar^2 \\pi^2 n^2}{2ml^2}\n$$\n<p class="center-block">\nNow we have our eigenvalues $E$ (indexed by $n$), and eigenfunctions $\\psi_n(x)$, for integer values of $n$\n</p>\n$$\n\\begin{align}\n\\psi_n(x) &= A\\sin\\left(\\frac{\\sqrt{2mE_n}}{\\hbar} x\\right) & E_n &= \\frac{\\hbar^2 \\pi^2 n^2}{2ml^2}\n\\end{align}\n$$\n\n<br>\n<br>\n<h3>\nNormalization:\n</h3>\nOne of the postulates of quantum mechanics states that $|\\psi(x)|^2$ is the probability that the particle will be found at position $x$.\nIn other words, $|\\psi(x)|^2$ is a probability density, therefore it needs to be normalized to 1.\nWe will use this condition to solve for the coefficient $A$.\n\n<div style="font-size: 133%;">\n$$\n\\int_{-\\infty}^\\infty|\\psi_n(x)|^2 = 1 \\\\\n|A|^2 \\int_{0}^l \\sin^2\\left(\\frac{\\sqrt{2mE_n}}{\\hbar} x\\right) = 1\\\\\n|A|^2 \\int_{0}^l \\sin^2\\left(\\frac{n\\pi}{l} x\\right) = 1\\\\\n|A|^2 \\frac{1}{2}\\left(x - \\frac{l}{2n\\pi}\\sin\\left(\\frac{2n\\pi}{l} x\\right)\\right)|_{0}^l = 1\\\\\nA  = \\sqrt{\\frac{2}{l}}\n$$\n</div>\nNote: $|\\psi(x)|^2$ is the modulus squared of $\\psi(x)$, and it is equivalent to $\\psi^*(x)\\psi(x)$\n\n<br>\n<br>\n<br>\n<br>\n<h3>\nSolution:\n</h3>\nThe normalized eigenstates and corresponding eigenvalues are:\n$$\n\\begin{align}\n\\psi_n(x) &= \\sqrt{\\frac{2}{l}}\\sin\\left(\\frac{\\sqrt{2mE_n}}{\\hbar} x\\right) & E_n &= \\frac{\\hbar^2 \\pi^2 n^2}{2ml^2}\n\\end{align}\n$$\nNote that setting $n=0$ again yields a trivial solution, and that a negative value of $n$ yields an eigenfunction that is equivalent to the one with the positive value of $n$.\nTherefore, we\'ll choose a convention where we only consider the positive integers of $n$ ($n=1,2,3...$)\n<br>\n<br>\n<br>\n\n<h3>\nInterpretation:\n</h3>\nWe just solved the time independent Schrodinger Equation, which gives us all the possible stationary states of the system.\nThere are an infinite number of eigenvalues, one for every positive integer value of $n$.\n\nThe eigenvalues correspond to the possible energies that can be measured. The lowest possible energy is when $n=1$, and is called the ground state.\n\n<br>\n<br>\n<br>\n<br>\n\n<h4>\nEigenstates:\n</h4>\n<div ng-repeat="state in eigenstates" class="col-md-4">\n    <p class="text-center">\n        $\\psi_{{state.number}}(x)$\n    </p>\n    <canvas-plot wave="state" colorOption="\'off\'"></canvas-plot>\n</div>\n<br>\n<h4>\nProbability Density:\n</h4>\n<div ng-repeat="state in eigenstates" class="col-md-4">\n    <p class="text-center">\n        $|\\psi_{{state.number}}(x)|^2$\n    </p>\n    <canvas-plot wave="state.getModulus()" colorOption="\'off\'"></canvas-plot>\n</div>\n<br>\n</math>\n\n<div class="col-xs-12" style="height:40px;"></div>\n\n<nav>\n  <ul class="pager" >\n    <li class="next"><a href="#/superposition">Next</a></li>\n  </ul>\n</nav>\n'),a.put("views/phaseplot.html",'<svg width="90" height="90" style="display:block; margin-left:auto; margin-right:auto"> </svg>'),a.put("views/phaseslider.html",'<style ng-bind-html="mystyles"></style> <rzslider rz-slider-model="wave.initPhase" rz-slider-options="slider.options"></rzslider>'),a.put("views/superposeqn.html",'<span>$ \\Psi(x,$</span> <span style="width: 25px; display: inline-block">{{Timer.time| number:0}}</span> <span>$) = $</span> <span ng-repeat="state in wave.eigenList"> <span style="color:#3B7EA1">{{state.mag / 100}}</span> <span>e<sup>i</sup></span> <span style="color:#d19000; width: 25px; display: inline-block"> <sup> {{(state.currPhase / 3.1415926 % 2) | number:1}}𝜋 </sup> </span> <span>$\\psi_{{state.number}}(x)$ </span> <span>{{$last ? \'\' : "$+$"}}</span> </span>'),a.put("views/superposition.html",'<div math> <h2> Superposition States: </h2> Any superposition of solutions is also a valid solution to the Time Dependent Schrodinger Equation. Therefore, we can write the general solution as: <div style="font-size: 133%"> $$ \\Psi(x) = c_1 \\psi_1(x) + c_2 \\psi_2(x) + c_3 \\psi_3(x) ... $$ </div> We will use $\\Psi$ to denote the wavefunction and $\\psi_n$ to denote the $n^{th}$ eigenstate. In general, the summation of states can run to infinity, but for now we will only consider superpositions constructed using the first three eigenstates. <br> <br> <br> <h3> Complex Coefficients </h3> The wavefunction postulate of quantum mechanics states that the wavefunction can be a complex-valued function. Therefore, the coefficients $c_n$ can be complex numbers. One common way to represent complex numbers is to use a complex exponential function. $$ \\begin{align} c &= |c| e^{i \\theta}\\\\ &=|c| (\\cos{\\theta} + i \\sin{\\theta}) \\end{align} $$ $$ \\begin{align} |c| &= \\sqrt{\\mathrm{Re}(c)^2 + \\mathrm{Im}(c)^2} & \\theta &= \\cos^{-1}{\\left(\\frac{\\mathrm{Re}(c)}{|c|}\\right)} \\end{align} $$ In this notation, $\\theta$ is called the phase, and $|c|$ is the modulus. This notation is convenient in QM because now we can easily take the modulus squared to obtain probabilities, and time dependence happens through the changing phases. <br> <br> <h3> Normalization Condition </h3> The only other constraint on our coefficients $c_n$ are that they must satisfy the normalization condition, which requires: <div style="font-size: 133%"> $$ \\int_{-\\infty}^\\infty|\\Psi(x)|^2 = 1 \\\\ |c_1|^2 + |c_2|^2 + |c_3|^2= 1 $$ </div> <h3> Interference Patterns </h3> Now, we can write down an expression for a wavefunction that consists of contributions from the first three particle in a box eigenstates. <div style="font-size: 133%"> $$ \\Psi(x,0) = |c_1|e^{i\\theta_1} \\psi_1(x) + |c_2|e^{i\\theta_2} \\psi_2(x) + |c_3|e^{i\\theta_3} \\psi_3(x) $$ </div> Below is a demo to explore how changing the coefficients $c_n$ changes the wavefunction. Note how interference patterns occur as a natural consequence of adding positive, negative, and complex numbers together. You can click and drag the plots to get a better perspective of the complex plane. In these plots, the horizontal axis is the x-axis, and the other 2 axes correspond to the complex plane. <br> <br> <div class="container" style="background-color:#f6f6f6"> <h3>Eigenstates:</h3> <div ng-repeat="state in eigenList" class="col-md-4"> <span perspective> <p class="text-center" style="font-size: 133%"> $\\psi_{{state.number}}$ </p> <div class="center-block"> <phase-plot wave="state"></phase-plot> </div> <canvas-plot wave="state"></canvas-plot> </span> <div class="center-block"> <label>Initial Phase $\\theta_{{state.number}}$</label> <phase-slider wave="state"></phase-slider> <br> <br> <label>Magnitude $|c_{{state.number}}|$</label> <magnitude-slider wave="state"> </magnitude-slider></div> </div> </div> <div class="col-xs-12" style="height:40px"></div> <span perspective> <h3>Wavefunction:</h3> <div class="text-center"> <superpos-eqn wave="superposition" style="font-size: 130%" class="text-center"></superpos-eqn> <div> <br> <div class="col-md-4"> <p class="text-center" style="font-size: 150%"> $\\psi_1(x), \\psi_2(x), \\psi_3(x)$ </p> <canvas-plot wave="eigenList"></canvas-plot> <p> Plot of all three eigenstates superimposed on top of each other. </p> </div> <div class="col-md-4"> <p class="text-center" style="font-size: 150%"> $\\Psi(x)$ </p> <canvas-plot wave="superposition"></canvas-plot> <p> Plot of the wavefunction. </p> </div> <div class="col-md-4"> <p class="text-center" style="font-size: 150%"> $|\\Psi(x)|^2$ </p> <canvas-plot wave="modulus"></canvas-plot> <p> Plot of the wavefunction\'s probability density. </p> </div> </div></div></span> </div> <div class="col-xs-12" style="height:40px"></div> <div class="text-center"> <nav> <ul class="pager"> <li class="previous"><a href="#/part-box">Prev</a></li> <li class="next"><a href="#/time-evolve">Next</a></li> </ul> </nav> </div>'),a.put("views/timeevolve.html",'<div math> <h2> Time Evolution </h2> <br> The equation that governs time evolution in quantum mechanics is the Time Dependent Schrodinger Equation: $$ i\\hbar\\frac{\\partial}{\\partial t} \\Psi(r,t) = \\hat{H}\\Psi(r,t) $$ For time-independent Hamiltonians, the general solution is given as: $$ \\begin{align} i\\hbar\\frac{\\partial}{\\partial t} \\Psi(r,t) &= \\hat{H}\\Psi(r,t)\\\\ \\frac{\\partial}{\\partial t} \\Psi(r,t) &= -\\frac{i}{\\hbar}\\hat{H}\\Psi(r,t) \\end{align} $$ $$ \\Psi(r,t) = e^{-\\frac{i}{\\hbar}\\hat{H}t}\\Psi(r,0)\\\\ $$ where $\\Psi(r,0)$ is the initial condition. This means if we know $\\Psi(r,0)$, the state of our system at time $t=0$, and we know the Hamiltonian, we can know what the state of the system at any future time as well. The exponential operator $e^{-\\frac{i}{\\hbar}\\hat{H}t}$ is called the time evolution operator, and satisfies: $$ e^{-\\frac{i}{\\hbar}\\hat{H}t} \\psi_n(x,0) = e^{-\\frac{i}{\\hbar}E_nt} \\psi_n(x,0) $$ for the energy eigenstates $\\psi_n$. (This can be shown to be true if you Taylor expand the time evolution operator, and apply the Time Independent Schrodinger Equation). <br> Now, we can write down the expression for an arbitrary time-dependent wavefunction consisting of the first three eigenstates: <div style="font-size: 133%"> $$ \\Psi(x,t) = c_1e^{\\frac{i}{\\hbar} E_1 t} \\psi_1(x) + c_2e^{\\frac{i}{\\hbar} E_2 t} \\psi_2(x) + c_3e^{\\frac{i}{\\hbar} E_3 t} \\psi_3(x) $$ </div> Note that all of the time dependence is in the phase of the coefficients in front of each eigenstate. This means that time dependence of a wavefunction enters into our expression by changing the phase of each eigenstate, at a frequency proportional to the energy of that eigenstate. <br> <br> Try setting $c_2=0$ and $c_3=0$ to see that eigenstates are stationary in time. <br> <br> <div class="col-md-8"> <button ng-click="timeButton()" class="btn btn-primary"> {{buttonText}} </button> <button ng-click="resetButton()" class="btn btn-primary" ng-show="showResetButton"> Reset Time </button> </div> <br> <br> <div class="container" style="background-color:#f6f6f6"> <h3>Eigenstates:</h3> <span perspective> <div ng-repeat="state in eigenList" class="col-md-4"> <p class="text-center"> $\\psi_{{state.number}}$ </p> <div class="center-block"> <phase-plot wave="state"></phase-plot> </div> <canvas-plot wave="state"></canvas-plot> <div class="center-block"> <label>Initial Phase </label> <phase-slider wave="state"></phase-slider> <br> <br> <label>Magnitude </label> <magnitude-slider wave="state"> </magnitude-slider></div> </div> </span> </div> <div class="col-xs-12" style="height:40px"></div> <span perspective> <h3>Wavefunction:</h3> <div class="text-center"> <superpos-eqn wave="superposition" style="font-size: 130%" class="text-center"></superpos-eqn> <div> <br> <div class="col-md-4"> <p class="text-center" style="font-size: 150%"> $\\psi_1(x), \\psi_2(x), \\psi_3(x)$ </p> <canvas-plot wave="eigenList"></canvas-plot> <p> Plot of all three eigenstates superimposed on top of each other. </p> </div> <div class="col-md-4"> <p class="text-center" style="font-size: 150%"> $\\Psi(x)$ </p> <canvas-plot wave="superposition"></canvas-plot> <p> Plot of the wavefunction. </p> </div> <div class="col-md-4"> <p class="text-center" style="font-size: 150%"> $|\\Psi(x)|^2$ </p> <canvas-plot wave="modulus"></canvas-plot> <p> Plot of the wavefunction\'s probability density. </p> </div> </div></div></span> </div> <div class="col-xs-12" style="height:40px"></div> <div class="text-center"> <nav> <ul class="pager"> <li class="previous"><a href="#/superposition">Prev</a></li> </ul> </nav></div>')}]);