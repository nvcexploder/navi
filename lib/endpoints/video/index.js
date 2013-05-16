// Load modules

var Hoek = require('hoek');
var Hapi = require('hapi');
var Http = require("http");
var Ws = require('ws');
var Fs = require('fs');

var Parser = require('./PaVEParser');
var ArDrone = require('ar-drone');


// Declare internals

var internals = {};


// Endpoint default configuration

internals.defaults = {
    enable: true,                                   // Optional - Enable or disable the endpoint
    path: '/video',                                 // Optional - Endpoint path
    droneIP: '192.168.1.1'
};


exports.register = function (pack, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options);

    if (settings.enable) {   
        internals.webSocketServer();
        internals.connectVideo();
    }

    next();
};


internals.webSocketServer = function () {

    var server = Http.createServer().listen(9000);
    var webSocketServer = new Ws.Server({ server: server, path: '/video' });

    internals.sockets = [];

    webSocketServer.on('connection', function (socket) {

        internals.sockets.push(socket);

        socket.on("close", function () {

            console.log("Closing socket");
            internals.sockets = internals.sockets.filter(function (el) {
                return el !== socket;
            });
        });
    });
};


internals.connectVideo = function (options) {

    options = options || {};
    options.timeout = options.timeout || 4000;

    var tcpVideoStream = new ArDrone.Client.PngStream.TcpVideoStream(options);
    var parser = new Parser();

    console.log("Connecting to drone on %s", options.ip || "192.168.1.1");

    tcpVideoStream.connect(function () {
        console.log('Connected to drone video');
        tcpVideoStream.pipe(parser);
    });

    tcpVideoStream.on('error', function (err) {

        console.log('There was an error: %s', err.message);
        tcpVideoStream.end();
        tcpVideoStream.emit('end');
    });

    parser.on('data', function (data) {

        internals.sockets.forEach(function (socket) {
            socket.send(data, { binary: true });
        });
    });
};


