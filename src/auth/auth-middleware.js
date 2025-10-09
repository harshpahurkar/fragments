// src/auth/auth-middleware.js
const passport = require('passport');
const logger = require('../logger');

function authorize(strategy) {
  // return a factory so callers can do `authorize('http')()` and get middleware
  return () => {
    return (req, res, next) => {
      logger.debug({ strategy, path: req.path }, 'authorize middleware invoked');
      return passport.authenticate(strategy, { session: false })(req, res, next);
    };
  };
}

module.exports = { authorize };
