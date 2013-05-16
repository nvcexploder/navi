// Load modules

var Hoek = require('hoek');


// Declare internals

var internals = {};


// Endpoint default configuration

internals.defaults = {
    enable: true,                                   // Optional - Enable or disable the endpoint
    path: '/{param*}'                               // Optional - Endpoint path
};


exports.register = function (pack, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options);

    if (settings.enable) {   
        pack.select('http').route({
            method: 'GET',
            path: settings.path,
            handler: {
                directory: {
                    path: './static',
                    //listing: true
                }
            }
        });
    }

    next();
};


