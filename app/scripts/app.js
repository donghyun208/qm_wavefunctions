'use strict';

/**
 * @ngdoc overview
 * @name qmWaveApp
 * @description
 * # qmWaveApp
 *
 * Main module of the application.
 */

angular
  .module('qmWaveApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'rzModule'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/part-box', {
        templateUrl: 'views/partinboxeig.html',
        controller: 'PartInBoxEigCtrl',
        controllerAs: 'PartInBoxEig'
      })
      .when('/superposition', {
        templateUrl: 'views/superposition.html',
        controller: 'SuperpositionCtrl',
        controllerAs: 'SuperpositionTime'
      })
      .when('/time-evolve', {
        templateUrl: 'views/timeevolve.html',
        controller: 'TimeEvolveCtrl',
        controllerAs: 'TimeEvolve'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html'
      })
      .otherwise({
        redirectTo: '/part-box'
      });
  });
