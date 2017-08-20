const JWT = require('jsonwebtoken');
const Utils = require('./utils');
const Uuidv4 = require('uuid/v4');
const Decode = require('jwt-decode');

const registerProvider = (request, reply) => {
  const payload = Utils.checkPayload(request.payload);

  if (!payload) {
    return reply({text : 'invalid data'}).code(401);
  }

  const message = Utils.validateRegisterPayload(payload);

  if (message) {
    return reply({text : message}).code(401);
  }

  return new require('./database').model.user.count({email : payload.email}, (err, count) => {
    if (count > 0) {
      return reply({text : 'email already exist'}).code(422)
    }

    const message = Utils.validateProviderPayload(payload);

    if (message) {
      return reply({text : message}).code(401);
    }

    // place_id : {type : String, required : true, unique : true},
    // coordinates: { type: [Number], defaultyy: [0,0], required : true},
    // name : { type : String, required : true },
    // description : { type : String, required : true },
    // website : {type : String, required: true},
    // images: { type : [String], default : []},
    // price_range : { type : Number, min: 1, max : 4 },
    // geo: { type : Mongoose.Schema.Types.Mixed, required : true },
    // place: { type : Mongoose.Schema.Types.Mixed, required : true }

    const newProvider = new require('./database').model.restaurant(
      Object.assign({}, {
        place_id : payload.geo.placeId,
        coordinates : [payload.geo.location.lng, payload.geo.location.lat]
      }, payload)
    );

    return newProvider.save((err, res) => {
      if (err || !res) {
        console.log('err', err);
        return reply({text : 'something went wrong'}).code(500);
      }

      const newUser = new require('./database').model.user(
        Object.assign({}, payload, {
          ip : request.info.remoteAddress,
          headers : request.headers,
          type : "PROVIDER",
          coordinates : [payload.geo.location.lng, payload.geo.location.lat],
          restaurant_id : res._id,
          mini_restaurant : res.toObject()
        })
      );

      return newUser.save((err, res) => {
        if (err || !res) {
          console.log('err', err);
          return reply({text : 'something went wrong'}).code(500);
        }

        return signAndSend(reply, res);
      });
    });
  });
};

const registerConsumer = (request, reply) => {
  const payload = Utils.checkPayload(request.payload);

  if (!payload) {
    return reply({text : 'invalid data'}).code(401);
  }

  const message = Utils.validateRegisterPayload(payload);

  if (message) {
    return reply({text : message}).code(401);
  }

  return new require('./database').model.user.count({email : payload.email}, (err, count) => {
    if (count > 0) {
      return reply({text : 'email already exist'}).code(422)
    }

    const newUser = new require('./database').model.user(
      Object.assign({}, payload, {
        ip : request.info.remoteAddress,
        headers : request.headers,
        type : "CONSUMER",
        coordinates : [payload.geo.location.lng, payload.geo.location.lat]
      })
    );

    return newUser.save((err, res) => {
      if (err || !res) {
        return reply({text : err.message ? err.message : 'something went wrong'}).code(500);
      }

      return signAndSend(reply, res);
    });
 });
};

const logout = (request, reply) => {
  return reply({text : 'ok'});
}

const login = (request, reply) => {
  const payload = Utils.checkPayload(request.payload);

  if (!payload) {
    return reply({text : 'invalid data'}).code(401);
  }

  return require('./database').model.user.find({email : payload.email}, (err, res) => {
    if (err || !res.length) {
      return reply({text : 'invalid data'}).code(401);
    }

    return checkPassword(request, reply, res[0], payload);
  });
}

const checkPassword = (request, reply, user, payload) => {
  return user.comparePassword(payload.password, (err, isMatch) => {
    if (err || !isMatch) {
      return reply({text : 'invalid data'}).code(401);
    }

    return signAndSend(reply, user);
  });
}

const signAndSend = (reply, user) => {
  let newUser = user.toObject ? user.toObject() : user._doc ? user._doc : user;

  delete newUser["password"];
  delete newUser["iat"];
  delete newUser["exp"];

  const token = JWT.sign(generateSignature(newUser), process.env.SECRET_JWT);

  return reply(Object.assign({}, newUser, {token : token}))
  .header("Authorization", token);
}

const validate = (decoded, request, callback) => {
  return require('./database').model.user.find({email : decoded.email}, (err, res) => {
    if (err || !res.length) {
      return callback(null, false);
    }

    return callback(null, true);
  });
}

const refresh = (request, reply) => {
  const decoded = Decode(request.auth.token);
  const timeToExpire = (decoded.exp - Math.floor(Date.now()/1000));

  if (timeToExpire < 0) {
    return reply({text : 'no auth'}).code(401);
  }

  return signAndSend(reply, decoded);
}

const generateSignature = (user) => {
  return Object.assign({}, user, {sid: Uuidv4(), exp: Math.floor(Date.now() / 1000) + (60)});
}

module.exports = {signAndSend, validate, registerConsumer, login, logout, refresh, registerProvider};
