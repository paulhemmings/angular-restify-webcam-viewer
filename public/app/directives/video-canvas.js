'use strict';

angular
    .module('MainApplicationModule')
    .directive('videoCanvas', ['$interval', function ($interval) {
        return {
            template: '<div class="videoCanvas" ng-transclude></div>',
            restrict: 'E',
            replace: true,
            transclude: true,
            scope:
            {
              onError: '&',
              onLoaded: '&',
              config: '=canvas'
            },
            link: function postLink($scope, element) {
                var canvas = null;

                function dataURItoBlob(dataURI) {
                    // convert base64 to raw binary data held in a string
                    var byteString = atob(dataURI.split(',')[1]);

                    // separate out the mime component
                    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                    // write the bytes of the string to an ArrayBuffer
                    var arrayBuffer = new ArrayBuffer(byteString.length);
                    var _ia = new Uint8Array(arrayBuffer);
                    for (var i = 0; i < byteString.length; i++) {
                        _ia[i] = byteString.charCodeAt(i);
                    }

                    var dataView = new DataView(arrayBuffer);
                    var blob = new Blob([dataView], { type: mimeString });
                    return blob;
                }

                function getFrame() {
                    return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
                }

                function drawFrame(frame) {
                    canvas.getContext('2d').putImageData(frame.data, 0, 0);
                }

                function getBlob() {
                    return dataURItoBlob(getDataUrl());
                }

                function getDataUrl() {
                    return canvas.toDataURL();
                }

                function drawDataUrl(dataUrl) {
                    var image = new Image();
                    image.src = dataUrl;
                    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
                }

                function captureFrame(video) {
                    canvas.width = video.clientWidth;
                    canvas.height = video.clientHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
                    return canvas;
                }

                function isHidden(toggle) {
                    angular.element(canvas).css('display', toggle ? 'none' : 'block');
                }

                function dimensions(dimensions) {
                    if (!!dimensions) {
                        canvas.width =  dimensions.width;
                        canvas.height =  dimensions.height;
                    }
                    return {
                        'width' : canvas.width,
                        'height' : canvas.height
                    };
                }

                function initialize() {
                    canvas = document.createElement('canvas');
                    element.append(canvas);

                    $scope.config = $scope.config || {};
                    $scope.config.getFrame = getFrame;
                    $scope.config.drawFrame = drawFrame;
                    $scope.config.getBlob = getBlob;
                    $scope.config.getDataUrl = getDataUrl;
                    $scope.config.drawDataUrl = drawDataUrl;
                    $scope.config.captureFrame = captureFrame;
                    $scope.config.isHidden = isHidden;
                    $scope.config.dimensions = dimensions;

                    if (!!$scope.onLoaded) {
                        $scope.onLoaded();
                    }
                }

                initialize();

            }
        };
      }]
    );
