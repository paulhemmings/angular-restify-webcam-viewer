'use strict';

/*
 * Main Angular module
 *
 * Style guide:
 * avoid polluting global namespace:
 *  var app = angular.module('app');
 */

angular.module('MainApplicationModule', ['ui.router', 'ngAnimate', 'ngCookies', 'webcam', 'ngLodash' ]);

/*
 * Add SPA Routing using route provider
 *
 * Style guide:
 * avoid using a variable and instead use chaining with the getter syntax
 *
 */

angular
    .module('MainApplicationModule')
    .config(['$stateProvider', '$urlRouterProvider', '$socketProvider',
        function($stateProvider, $urlRouterProvider, $socketProvider) {
          $socketProvider.setConnectionUrl(window.location.protocol + '//' + window.location.host);
          $urlRouterProvider.otherwise('/viewer');
          $stateProvider
              .state('viewer', {
                  url:'/viewer',
                  views: {
                      'content': {
                          templateUrl: '/app/partials/viewer.html',
                          controller: 'ViewerController'
                      }
                  }
              });
    }])
    .run(function($rootScope, $socket, $timeout) {
          function checkin() {
              $socket.emit('stay-alive', 'pauls-room', function(response) {
                  console.log(response);
                  $timeout(checkin, 100000);
              });
          }
          $timeout(checkin, 100000);
      });
