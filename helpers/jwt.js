const settings = require("../config/config.json");
const moment = require("moment");
const jwt = require("jwt-simple");

//
// Encode (van username naar token)
//
function encodeToken(username) {
  const playload = {
    exp: moment()
      .add(10, "days")
      .unix(),
    iat: moment().unix(),
    sub: username
  };
  return jwt.encode(playload, settings.remote.app.secretkey);
}

//
// Decode (van token naar username)
//
function decodeToken(token, cb) {
  try {
    const payload = jwt.decode(token, settings.remote.app.secretkey);

    // Check if the token has expired
    if (moment().unix() > payload.exp) {
      cb(new Error("token_has_expired"));
    } else {
      payload.email = 'dkroeske@gmail.com'
      cb(null, payload);
    }
  } catch (err) {
    cb(err, null);
  }
}

module.exports = {
  encodeToken,
  decodeToken
};
