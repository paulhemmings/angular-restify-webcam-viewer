'use strict';

var restify = require('restify'),
    CookieParser = require('restify-cookies'),
    fs = require('fs'),
    socketio = require('socket.io');

// instantiate the server
// http://mcavage.me/node-restify/#Bundled-Plugins

var server = restify.createServer();
server.use(restify.bodyParser({ mapParams: false }));
server.use(CookieParser.parse);

// instantiate the socket, get it listening to the server
// http://mcavage.me/node-restify/#socketio
// https://github.com/restify/node-restify/issues/717

var io = socketio.listen(server.server);

// serve static content
// http://mcavage.me/node-restify/#Server-API

server.get(/\/(lib|app|styles|scripts)\/?.*/, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));

// serve the root page

server.get('/', restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));

// bootstrap database and models

// require( __dirname + '/database/database');

// bootstrap services

var modelsPath = __dirname + '/services';
var services = {};
fs.readdirSync(modelsPath).forEach(function(file) {
	console.log('load service ' + file);
  var service = require(modelsPath + '/' + file);
  services[service.name] = service;
});

// bootstrap resources

var modelsPath = __dirname + '/resources';
fs.readdirSync(modelsPath).forEach(function(file) {
	console.log('load resource ' + file);
  var resource = require(modelsPath + '/' + file);
  resource.initialize(server, services);
});

// bootstrap socket events

io.sockets.on('connection', function (socket) {
    console.log('a user connected');
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
            console.log(data);
    });
    socket.on('echo', function (data) {
        console.log('emite echo');
        socket.emit('echo', data);
    });
    socket.on('echo-ack', function (data, callback) {
        callback(data);
    });
    socket.on('join', function(room) {
        socket.join(room);
    });
    socket.on('request-frame', function(room) {
      console.log('emite request-frame');
      socket.to(room).emit('request-frame');      
    });
    socket.on('frame-available', function(room) {
        console.log('emite frame-available');
        socket.to(room).emit('frame-available');
    });
});

// start the server listening

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
