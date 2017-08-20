const JWT = require('jsonwebtoken');
module.exports.checkPayload = (payload) => {
  let p;

  if (!payload) {
    return null;
  }

  try {
    p = typeof payload === 'string' ? JSON.parse(payload) : payload;
  } catch (err) {
    return null;
  }

  return p;
}

module.exports.validateProviderPayload = (payload) => {
  if (!payload.geo || !payload.geo.location) {
    return "a valid geo is required";
  }

  if (!payload.geo.placeId) {
    return "place must be linked with placeId";
  }

  if (!payload.description) {
    return "a valid description is required";
  }

  if (!payload.price_range) {
    return "a valid price range is required";
  }

  return null;
}

module.exports.validateRegisterPayload = (payload) => {
  if (!payload.email) {
    return "a valid email is required";
  }

  if (!payload.geo || !payload.geo.location) {
    return "a valid geo is required";
  }

  if (!payload.password || payload.password.length < 4) {
    return "a valid password is required";
  }

  if (!payload.name) {
    return "a valid name is required";
  }

  return null;
}
