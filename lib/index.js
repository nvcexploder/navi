// Load modules

var Hoek = require('hoek');
var Hapi = require('hapi');
var Async = require('async');


// Declare internals

var internals = {
    endpointsDir:  './endpoints/'
};


// Plugin level... Adds endpoints dynamically based on configuration options

exports.register = function (pack, options, next) {

    var endpoints = [];

    Object.keys(options).forEach(function (option) {
       
        endpoints.push({
            name: option,
            options: options[option],
            register: require(internals.endpointsDir + option).register
        });
    });

    Async.forEachSeries(endpoints, function (endpoint, next) {

        Hoek.assert(typeof(endpoint.register) === 'function', 'Endpoint ' + endpoint.name + ' must contain a function "register"');

        endpoint.register(pack, endpoint.options, next);
    },
    function (err) {
        
        next(err);
    });
};


