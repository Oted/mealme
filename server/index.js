'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Glue = require('glue');
const Utils = require('./lib/utils');
const JWT = require('jsonwebtoken');
const Auth = require('./lib/auth');
const DB = new require('./lib/database');

require('dotenv').config({path:'../.env'});

const secret = process.env.SECRET_JWT;

if (!secret) {
  throw Error('Env seecret not loaded properly');
}

const server = new Hapi.Server();

const options = {};
const manifest = {
  server: {},
  connections: [
    {
      host: 'localhost',
      port: 8000,
      routes: {
        cors: true
      },
      labels: ['web']
    }
  ],
  registrations: [
    {
      plugin: {
        register: 'hapi-auth-jwt2'
      }
    },
    {
      plugin: {
        register: 'inert'
      }
    }
  ]
};

Glue.compose(manifest, options, (err, server) => {
  if (err) {
    throw err;
  }

  console.log('Registered!');

  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    validateFunc: Auth.validate,
    verifyOptions: {
      algorithms: [ 'HS256' ]
    }
  });


  return DB.connect({}, () => {
    if (err) {
      throw err;
    }

    console.log('Database up and running on ' + process.env.MONGO_URL);

    server.auth.default('jwt');

    require('./lib/routes')(server);

    server.start(() => {
      console.log('Server running at:', server.info.uri);
    });
  });
});

