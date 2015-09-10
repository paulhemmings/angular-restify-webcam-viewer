'use strict';

exports.initialize = function(server, services) {

  // grab the services we need

  var videoService = services.VideoService;

  server.post('/video/upload', function(req, res, next) {
      console.log('retrieved recording');
      videoService.storeData(req.body, 'capture.webm', function() {
          res.send(200, { } );
          next();
      });
  });

  server.post('/video/uploadFrame', function(req, res, next) {
      console.log('retrieved frame');
      videoService.storeData(req.body, 'frame.png', function() {
          res.send(200, { } );
          next();
      });
  });

  server.get('/video/frame', function(req, res, next) {
      console.log('retrieved frame');
      videoService.getData('frame.png', function(data) {
          console.log('responding with data');
          res.setHeader('content-type', 'image/png');
          res.send(200, data);
          next();
      });
  });

};
