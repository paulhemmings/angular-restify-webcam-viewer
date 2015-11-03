'use strict';

angular
    .module('MainApplicationModule')
    .controller('ViewerController', ['$scope', '$timeout', '$socket', 'lodash',
        function($scope, $timeout, $socket, lodash) {

          $scope.roomName = 'pauls-room';
          $scope.occupants = [];
          $scope.status = [];
          $scope.showSelf = true;

          function setStatus(status) {
              console.log(status);
              $scope.status.push(status);
              if ($scope.status.length > 5) {
                  $scope.status.splice(0, 1);
              }
          }

          $scope.joinRoom = function(room) {
              $socket.emit('join', room, function() {
                  loadOccupants();
              });
          };

          $scope.ping = function() {
              setStatus('ping sent');
              $socket.emit('ping', $scope.roomName);
          };

          $scope.pong = function() {
              setStatus('pong sent');
              $socket.emit('pong', $scope.roomName);
          };

          $scope.pongHandler = function() {
              setStatus('pong received');
          };

          $scope.requestFrame = function(occupant) {
              setStatus('request frame');
              $socket.emit('request-frame', {
                  'occupant': occupant.id,
                  'room': $scope.roomName
              });
          };

          $scope.frameAvailable = function(data) {
              setStatus('frame received');
              $scope.occupants.forEach(function(occupant) {
                  if (occupant.id === data.id) {
                      occupant.canvas.dimensions(data.dimensions);
                      occupant.canvas.drawDataUrl(data.frame);
                      if (occupant.viewing) {
                          $timeout(function() {
                              $scope.requestFrame(occupant);
                          }, parseInt(occupant.intervalDuration));
                      }
                  }
              });
          };

          $scope.startWatching = function(occupant) {
              setStatus('start watching');
              occupant.viewing = true;
              $scope.requestFrame(occupant);
          };

          $scope.stopWatching = function(occupant) {
              setStatus('stopped received');
              occupant.viewing = false;
          };

          $scope.onLoaded = function(canvas) {
              canvas.isHidden(false);
          };

          $scope.toggleSelfView = function() {
              $scope.showSelf = !$scope.showSelf;
          };

          $scope.reloadPage = function() {
              window.location.href = unescape(window.location.pathname);
          };

          $scope.captureFrame = function(occupant) {
              if ($socket.id() !== occupant) {
                  return;
              }
              setStatus('capture frame');
              $scope.canvas.captureFrame($scope.channel.video);
              setStatus('send frame');
              $socket.emit('frame-available', {
                  'room' : $scope.roomName,
                  'data' : {
                      'id': $socket.id(),
                      'frame' : $scope.canvas.getDataUrl(),
                      'dimensions' : {
                          'width' : $scope.channel.video.width,
                          'height' : $scope.channel.video.height
                      }
                  },
              });
          };

          function addOccupant(id) {
              if ($socket.id() === id) {
                  return;
              }
              if ($scope.occupants.length > 0 && !!lodash.findWhere($scope.occupants, id)) {
                  return;
              }
              $scope.occupants.push({
                  'id': id,
                  'intervalDuration': '1000',
                  'viewing': false,
                  'canvas': {
                      'id': id
                  }
              });
          }

          function removeOccupant(id) {
              var index = lodash.findIndex($scope.occupants, { 'id' : id});
              if (index > -1) {
                  $scope.occupants.splice(index, 1);
              }
          }

          function loadOccupants() {
              $socket.emit('occupants', $scope.roomName, function(occupants) {
                  $scope.occupants.length = 0;
                  for (var occupant in occupants) {
                      addOccupant(occupant);
                  }
              });
          }

          function initializeSocket() {
              setStatus('set up sockets');
              $scope.joinRoom($scope.roomName);

              $socket.on('user-joined', addOccupant);
              $socket.on('user-left', removeOccupant);
              $socket.on('frame-available', $scope.frameAvailable);
              $socket.on('ping', $scope.pong);
              $socket.on('pong', $scope.pongHandler);

              $socket.on('request-frame', $scope.captureFrame);
              $socket.on('disconnect', $scope.reloadPage);
          }

          initializeSocket();

        }
    ]);
