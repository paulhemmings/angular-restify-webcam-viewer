'use strict';

angular
    .module('MainApplicationModule')
    .service('uploadDataService', function($http) {

        function upload(videoblob) {
            console.log('uploading recording');
            return $http({
                url: '/video/upload',
                headers: {'Content-Type': 'video/webm'},
                method: 'POST',
                data: videoblob,
                transformRequest: []
            });
        }

        function uploadFrame(frame) {
          console.log('uploading frame');
          return $http({
              url: '/video/uploadFrame',
              headers: {'Content-Type': 'image/png'},
              method: 'POST',
              data: frame,
              transformRequest: []
          });
        }

        return {
            upload: upload,
            uploadFrame: uploadFrame
        };

    });
