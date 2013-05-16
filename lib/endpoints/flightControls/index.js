// Load modules

var Hapi = require('hapi');
var Hoek = require('hoek');
var Http = require("http");
var Ws = require('ws');

var ArDrone = require('ar-drone');


// Declare internals

var internals = {};


// Endpoint default configuration

internals.defaults = {
    enable: true,                                   // Optional - Enable or disable the endpoint
    path: '/flightControls'                         // Optional - Endpoint path
};


exports.register = function (pack, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options);

    if (settings.enable) {   
        internals.flightControls();
    }

    next();
};


internals.flightControls = function () {

    var options = options || {};
    var client = new ArDrone.createClient(options);
    console.log("Connecting to drone on %s", options.ip || "192.168.1.1");

    var server = Http.createServer().listen(9100);
    var webSocketServer = new Ws.Server({ server: server, path: '/flightControls' });

    internals.sockets = [];

    webSocketServer.on('connection', function (socket) {

        internals.sockets.push(socket);

        socket.on('data', function (data) {
            
            try {
                var commands = JSON.parse(data);

                Object.keys(commands).forEach(function (command) {

                    if (client[command] === 'function') {

                        client[command](commands[command]);
                    }
                });
            }
            catch (err ){
                console.log(err);
            }
        });

        socket.on('close', function () {

            console.log('Closing socket');
            internals.sockets = internals.sockets.filter(function (el) {
                return el !== socket;
            });
        });
    });
};


