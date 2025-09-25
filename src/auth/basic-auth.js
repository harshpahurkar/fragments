// src/auth/basic-auth.js

// Configure HTTP Basic Auth strategy for Passport, see:
// https://github.com/http-auth/http-auth-passport

const auth = require('http-auth');
const passport = require('passport');
const authPassport = require('http-auth-passport');

// You'll need to add logger if it's not already imported
const logger = require('../logger');

// We expect HTPASSWD_FILE to be defined.
if (!process.env.HTPASSWD_FILE) {
  throw new Error('missing expected env var: HTPASSWD_FILE');
}

// Log that we're using Basic Auth
logger.info('Using HTTP Basic Auth for auth');

// Create the basic auth strategy
const basicAuthStrategy = authPassport(
  auth.basic({
    file: process.env.HTPASSWD_FILE,
  })
);

// Register the strategy with passport
passport.use('http', basicAuthStrategy);

module.exports.strategy = () => basicAuthStrategy;

module.exports.authenticate = () => passport.authenticate('http', { session: false });
