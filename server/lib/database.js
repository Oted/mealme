const Mongoose = require('mongoose');
const Utils = require('./utils.js');
const Fs = require('fs');

let internals = {
  'db' : null,
  'instance' : null,
  'connected' : false,
  'table_types' : [
    'available'
  ]
};

function Models() {
  this.model = {};
};

Models.prototype.connect = function(options, done) {
  if (typeof options === "function") {
    done = options;
    options = {};
  }

  // ES6 promises
  Mongoose.Promise = Promise;

  // mongodb connection
  Mongoose.connect(options.url || process.env.MONGO_URL, {
    useMongoClient: true,
    promiseLibrary: global.Promise
  });

  const db = Mongoose.connection;

  db.on('error', (err) => {
    throw err;
  });

  return db.once('open', () => {
    internals.connected = true;
    internals.db = db;

    Fs.readdirSync(__dirname + '/models').filter((model) => {
      return model.split('.').pop() === "js";
    }).map((model) => {
      this.model[model.split('.').shift()] = require('./models/' + model)(Mongoose);
      console.log('Model \'' + model.split('.').shift() + '\' set up');
    });

    return done();
  });
};

if (!internals.instance) {
  internals.instance = new Models();
}

module.exports = internals.instance;
