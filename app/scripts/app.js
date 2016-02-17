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
    'rzModule',
    'ui.bootstrap',
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/part-box');
    $stateProvider
      .state('part-box', {
        url: '/part-box',
        templateUrl: 'views/partinboxeig.html',
        controller: 'PartInBoxEigCtrl',
        controllerAs: 'PartInBoxEig'
      })
      .state('superposition', {
        url: '/superposition',
        templateUrl: 'views/superposition.html',
        controller: 'SuperpositionCtrl',
        controllerAs: 'SuperpositionTime'
      })
      .state('time-evolve', {
        url: '/time-evolve',
        templateUrl: 'views/timeevolve.html',
        controller: 'TimeEvolveCtrl',
        controllerAs: 'TimeEvolve'
      })
      .state('demo', {
        url: '/demo',
        templateUrl: 'views/demo.html',
        controller: 'DemoCtrl',
        controllerAs: 'Demo'
      })
      .state('demo.box', {
        url: '/box',
        templateUrl: 'views/boxdemo.html',
        controller: 'BoxDemoCtrl',
        controllerAs: 'BoxDemo'
      })
      .state('demo.ho', {
        url: '/ho',
        templateUrl: 'views/hodemo.html',
        controller: 'HODemoCtrl',
        controllerAs: 'HODemo'
      })
      // .state('demo.step', {
      //   url: '/step',
      //   templateUrl: 'views/stepdemo.html',
      //   controller: 'StepDemoCtrl',
      //   controllerAs: 'StepDemo'
      // })
      .state('demo.ring', {
        url: '/ring',
        templateUrl: 'views/ringdemo.html',
        controller: 'RingDemoCtrl',
        controllerAs: 'RingDemo'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'views/contact.html'
      })
}]);
