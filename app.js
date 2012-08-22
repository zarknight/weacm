var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    express = require('express'),
    socketio = require('socket.io'),
    mongoose = require('mongoose');

// Configuration
var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'zac sec tac cat' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

// Create Servers

var httpServer = http.createServer(app);
var io = socketio.listen(httpServer, { log: false });
var db = mongoose.connect('mongodb://127.0.0.1/weacm');

// Models, Routes and Real-Time handlers
require('./models').init();
require('./routes').init(app);
require('./sockets').init(io);

// Main

httpServer.listen(app.get('port'), function() {
  console.log("App server listening on port %d in %s mode.", app.get('port'), app.settings.env);
});
