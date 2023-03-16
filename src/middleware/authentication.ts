const jwt = require('jsonwebtoken');

const CONFIG = require('../config');

module.exports = (req, res, next) => {
  if (typeof req.headers.cookie !== 'string') {
    return res.status(401).send({ error: CONFIG.ERROR_MESSAGES.UNAUTHORIZED });
  }

  // There's no doubt other ways to extract the auth token from incoming requests, but just doing it
  // the "quick and dirty" way for now:
  const token = req.headers.cookie.split(`${CONFIG.JWT_TOKEN_NAME}=`)[1].split(';')[0];

  jwt.verify(token, CONFIG.JWT_SECRET, (err, decoded) => {
    if (err === null) {
      res.locals.username = decoded.u;
      next();
    } else {
      res.status(401).send({ error: CONFIG.ERROR_MESSAGES.UNAUTHORIZED });
    }
  });
};
