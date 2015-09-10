'use strict';

angular
    .module('MainApplicationModule')
    .controller('HomeController', ['$scope', '$interval', 'uploadDataService',
        function($scope, $interval, uploadDataService) {

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
                  console.log('received/sending frame');
                  uploadDataService.uploadFrame(frame);
              });
          }

          $scope.startCaptureFrames = function() {
              $scope.interval = $interval($scope.captureFrame, 1000);
          }
          $scope.stopCaptureFrames = function() {
              $scope.interval.cancel();
          }
        }
    ]);
