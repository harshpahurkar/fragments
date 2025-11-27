// src/auth/auth-middleware.js
const passport = require('passport');
const logger = require('../logger');

function authorize(strategy) {
  // return a factory so callers can do `authorize('http')()` and get middleware
  return () => {
    return (req, res, next) => {
      logger.debug({ strategy, path: req.path }, 'authorize middleware invoked');
      return passport.authenticate(strategy, { session: false }, (err, user) => {
        // If there's an error, pass it to the error handler
        if (err) {
          return next(err);
        }
        // If no user (authentication failed), return 401 with our error format
        if (!user) {
          const { createErrorResponse } = require('../response');
          return res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        }
        // Authentication succeeded, attach user and continue
        req.user = user;
        return next();
      })(req, res, next);
    };
  };
}

module.exports = { authorize };
