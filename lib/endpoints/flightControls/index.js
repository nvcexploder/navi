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
        internals.sockets = [];
        internals.flightControls();
    }

    next();
};


internals.flightControls = function () {

    var options = options || {};
    var client = new ArDrone.createClient(options);
    console.log("Connecting to drone on %s", options.ip || "192.168.1.1");

    var server = Http.createServer().listen(9100);
    var socket = new Ws.Server({ server: server, path: '/flightControls' });

    socket.on('connection', function (socket) {

        console.log('client connected');
        internals.sockets.push(socket);

        socket.onmessage = function(data) {
                console.log('got data from client');
                console.log(data);
            try {
                var commands = JSON.parse(data.data);
                console.log(commands);

                Object.keys(commands).forEach(function (command) {

                    if (command === 'takeoff' ||
                        command === 'land') {

                        client[command](function () {
                            console.log(command + ' complete')
                        });
                    }
                    else if (command === 'stop' ||
                        command === 'disableEmergency') {

                        client[command]();
                    }
                    else if (typeof client[command] === 'function') {

                        client[command](commands[command]);
                    }
                });
            }
            catch (err ){
                console.log(err);
            }
        }
    });

    socket.on('close', function () {

        console.log('Closing socket');
        internals.sockets = internals.sockets.filter(function (el) {
            return el !== socket;
        });
    });
};


