const NodeCache = require( "node-cache");
const Utils = require('./utils');

const MyCache = new NodeCache({
  stdTTL: 86400, checkperiod: 120
});

module.exports = (server) => {
  const Auth = require('./auth');

  //login
  server.route({
    method: 'POST',
    path:'/api/login',
    config: {auth : false},
    handler: Auth.login
  });

  //logout
  // server.route({
    // method: 'POST',
    // path:'/api/table',
    // config: {auth : true},
    // handler: (request, reply) => {

    // }
  // });

  //logout
  server.route({
    method: 'POST',
    path:'/api/refresh',
    config: {auth : 'jwt'},
    handler: Auth.refresh
  });

  //logout
  server.route({
    method: 'POST',
    path:'/api/logout',
    config: {auth : 'jwt'},
    handler: Auth.logout
  });

  //signup
  server.route({
    method: 'POST',
    path:'/api/registerConsumer',
    config: {auth : false},
    handler: Auth.registerConsumer
  });

  //signup
  server.route({
    method: 'POST',
    path:'/api/registerProvider',
    config: {auth : false},
    handler: Auth.registerProvider
  });
}
