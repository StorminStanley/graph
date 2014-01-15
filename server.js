'use strict';

// Node.js backend for the app
var express = require('express')
  , config = require('mech-config').server
  , app = express()
  , http = require('http')
  , sockjs  = require('sockjs');

//body parser next, so we have req.body
//we don't need it at the moment and it's breaking http-proxy POST request routing
//app.use(express.bodyParser());

// Simple logger middleware
app.use(function (req, res, next) {
  console.log("Received %s %s:", req.method, req.url);
  if (req.method === "POST") { console.log(req.body); }
  if (req.query.length > 0) { console.log(req.query); }
  next();
});

// Static first, to ignore logging static requests
app.use(express['static'](__dirname + '/' + config['static-directory']));

app.use(express.errorHandler({dumpExceptions: true }));

// Routes to controllers

app.get('/config', require('./lib/config.js'));

var websocket = sockjs.createServer({
  sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"
});

require('./lib/apps/graph/main.js')(websocket);

var server = http.createServer(app);
websocket.installHandlers(server, {prefix: '/graph'});

server.listen(config.port);
console.log('Express listening on port ' + config.port);
console.log('Serving static content from: ' + __dirname + '/' + config['static-directory']);
