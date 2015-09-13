'use strict';

/*
 * Main Angular module
 *
 * Style guide:
 * avoid polluting global namespace:
 *  var app = angular.module('app');
 */

angular.module('MainApplicationModule', ['ui.router', 'ngAnimate', 'ngCookies','webcam' ]);

/*
 * Add SPA Routing using route provider
 *
 * Style guide:
 * avoid using a variable and instead use chaining with the getter syntax
 *
 */

angular
    .module('MainApplicationModule')
    .config(['$stateProvider', '$urlRouterProvider', '$socketProvider', function($stateProvider, $urlRouterProvider, $socketProvider) {
      $socketProvider.setConnectionUrl('http://localhost:8080');
      $urlRouterProvider.otherwise('/home');
      $stateProvider
          .state('home', {
              url:'/home',
              views: {
                  'content': {
                      templateUrl: '/app/partials/home.html',
                      controller: 'HomeController'
                  }
              }
          })
          .state('viewer', {
              url:'/viewer',
              views: {
                  'content': {
                      templateUrl: '/app/partials/viewer.html',
                      controller: 'ViewerController'
                  }
              }
          });
    }]);
