'use strict';

var restify = require('restify'),
    socketio = require('socket.io'),
    DEFAULT_PORT = 5000;

// instantiate the server
// http://mcavage.me/node-restify/#Bundled-Plugins

var server = restify.createServer();
server.use(restify.bodyParser({ mapParams: false }));


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

// bootstrap socket events

io.sockets.on('connection', function (socket) {

    console.log('a user connected');

    socket.on('join', function(room, callback) {
        console.log('a user joined ' + room + ':' + socket.id);
        socket.join(room);
        socket.to(room).emit('user-joined', socket.id);
        if (callback) callback(room);
    });

    socket.on('leave', function(room, callback) {
        console.log('a user left ' + room);
        socket.leave(room);
        if(!callback) return;
        callback(room);
    });

    socket.on('disconnect', function() {
        for (var room in io.sockets.adapter.rooms) {
            // send to all remaining rooms, as by this point socket already
            // removed from rooms server side. not secure but works.
            console.log('tell room that user left', room, socket.id);
            socket.to(room).emit('user-left', socket.id);
        }
        console.log('a user disconnected: ' + socket.id);
    });

    socket.on('ping', function(room) {
        socket.to(room).emit('ping');
    });

    socket.on('pong', function(room) {
        socket.to(room).emit('pong');
    });

    socket.on('occupants', function(room, callback) {
        console.log('user requested list of occupants');
        callback(io.sockets.adapter.rooms[room]);
    });

    socket.on('stay-alive', function(room, callback) {
        console.log('a user renewed connection in ' + room);
        callback('still alive');
    });

    socket.on('request-frame', function(request) {
      console.log('emit request-frame to ' + request.room);
      socket.to(request.room).emit('request-frame', request.occupant);
    });

    socket.on('frame-available', function(roomdata) {
        console.log('emit frame-available to ' + roomdata.room);
        socket.to(roomdata.room).emit('frame-available', roomdata.data);
    });

});

// start the server listening

server.listen(process.env.PORT || DEFAULT_PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
