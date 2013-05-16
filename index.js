// Load modules

var Hapi = require('hapi');


// Declare internals

var internals = {}; 


internals.server = new Hapi.Server('localhost', 8000, { 
    labels: ['http'] ,
    files: {
        relativeTo: 'cwd'
    }
});

var options = {
    'video': {
        enable: true,
        path: '/video',
        droneIP: '192.168.1.1'
    },
    'static': {
        enable: true,
        path: '/{param*}'
    }
};

internals.server.pack.require('./lib', options, function (err) {

    if (err) {
        console.log(err);
    }
    else {
        internals.server.start();
        console.log('Hapi Server Started');
    }
});


