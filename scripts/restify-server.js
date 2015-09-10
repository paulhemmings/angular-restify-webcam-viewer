'use strict';

var restify = require('restify'),
    CookieParser = require('restify-cookies'),
    fs = require('fs');

// instantiate the server
// http://mcavage.me/node-restify/#Bundled-Plugins

var server = restify.createServer();
server.use(restify.bodyParser({ mapParams: false }));
server.use(CookieParser.parse);

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

// start the server listening

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
