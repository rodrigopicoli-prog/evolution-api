const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function optionalAuthMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.slice(7);
    req.user = jwt.verify(token, env.jwtSecret);
  } catch (_error) {
    req.user = undefined;
  }

  return next();
}

module.exports = { optionalAuthMiddleware };
