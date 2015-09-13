'use strict';

angular
    .module('MainApplicationModule')
    .controller('HomeController', ['$scope', '$interval', '$socket', 'uploadDataService',
        function($scope, $interval, $socket, uploadDataService) {

          $scope.roomName = 'pauls-room';

          $scope.channel = {
              // the fields below are all optional
              videoHeight: 800,
              videoWidth: 600,
              captureFrame: null,
              video: null // Will reference the video element on success
          };

          $scope.onStream = function(stream) {
              $scope.mediaRecorder = new MediaStreamRecorder(stream);
              $scope.mediaRecorder.mimeType = 'video/webm';
              $scope.mediaRecorder.ondataavailable = uploadDataService.upload;
          };

          $scope.startRecording = function() {
              console.log('start recording');
              $scope.mediaRecorder.start(3 * 1000);
          };

          $scope.stopRecording = function() {
              console.log('stopped recording');
              $scope.mediaRecorder.stop();
          }

          $scope.captureFrame = function() {
              console.log('capture frame');
              $scope.channel.captureFrame(function(frame) {
                  console.log('uploading frame');
                  uploadDataService.uploadFrame(frame).then(function() {
                      console.log('emit frame available socket event');
                      $socket.emit('frame-available', $scope.roomName);
                  });
              });
          }

          $scope.startCaptureFrames = function() {
              $scope.interval = $interval($scope.captureFrame, 1000);
          }

          $scope.stopCaptureFrames = function() {
              $scope.interval.cancel();
          }

          function initializeSocket() {
              $socket.emit('join', $scope.roomName);
              $socket.on('request-frame', $scope.captureFrame);
          }

          initializeSocket();

        }
    ]);
