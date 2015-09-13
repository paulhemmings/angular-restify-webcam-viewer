'use strict';

angular
    .module('MainApplicationModule')
    .controller('ViewerController', ['$scope', '$interval', '$socket',
        function($scope, $interval, $socket) {

          $scope.roomName = 'pauls-room';

          $scope.emitBasic = function emitBasic() {
              console.log('echo event emited');
              $socket.emit('echo', $scope.dataToSend);
              $scope.dataToSend = '';
          };

          $scope.emitACK = function emitACK() {
              $socket.emit('echo-ack', $scope.dataToSend, function (data) {
                  //se nao tivesse sido feito $apply
                  //a variavel $scope não seria reconhecida
                  $scope.serverResponseACK = data;
              });
              $scope.dataToSend = '';
          };

          $scope.requestFrame = function() {
              $socket.emit('request-frame', $scope.roomName);
          };

          $scope.startWatching = function() {
              $socket.on('frame-available', function() {
                  console.log('started watching');
                  $scope.imageSrc = '/video/frame?random=' + new Date();
              });
              $scope.interval = $interval($scope.requestFrame, 1000);
          };

          $scope.stopWatching = function() {
              $socket.off('frame-available', function() {
                  console.log('stopped watching');
              });
              $interval.cancel($scope.interval);
          }

          function initializeSocket() {
              $socket.emit('join', $scope.roomName);
              $socket.on('echo', function (data) {
                  $scope.serverResponse = data;
              });
          }

          initializeSocket();

        }
    ]);
