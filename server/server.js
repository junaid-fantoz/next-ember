'use strict';

const Hapi = require('@hapi/hapi');

const launches = require('./resources/launches.json');
const launchpads = require('./resources/launchpads.json');


const getLaunchesHandler = (req, resp) => {
  console.log('GET /launches');
  return resp(launches);
  
};

const getLaunchPadsHandler = (req, resp) => {
  console.log('GET /launchpads');
  return resp(launchpads);
};

const init = async () => {

    const server = Hapi.server({
        port: 8001,
        host: 'localhost'

    });

    server.route({
        method: 'GET',
        path:'/launches',
        handler: (req, resp) => {

          return launches ;
        }

    });

    server.route({
      method: 'GET',
      path: '/launchpads',
      handler: (req, resp) => {

        return launchpads ;
      }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
