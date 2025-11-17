const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const logger = require('./logger');
const pinoHttp = require('pino-http')({ logger });
const authenticate = require('./auth');

const app = express();

// Attach pino HTTP logger
app.use(pinoHttp);
app.use(helmet());
// Enable CORS and expose the Location header so browser clients can read it
// (the server sets a Location header on POST /v1/fragments when creating a fragment)
app.use(
  cors({
    // reflect request origin (allows browser to send requests from localhost during testing)
    origin: true,
    // expose Location so browser JavaScript can read it from the response
    exposedHeaders: ['Location'],
  })
);
app.use(compression());
app.use(express.json());

// Attach an X-App-Version header (helps with debugging/verification)
// This uses the version from package.json so the running container can be
// identified by its image version.
const { version: appVersion } = require('../package.json');
app.use((req, res, next) => {
  res.setHeader('X-App-Version', appVersion);
  next();
});

passport.use(authenticate.strategy());
app.use(passport.initialize());

app.use('/', require('./routes')); // includes /v1 with auth

const { createErrorResponse } = require('./response');

app.use((req, res) => {
  res.status(404).json(createErrorResponse(404, 'not found'));
});

// error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';
  if (status > 499) logger.error({ err }, 'Error processing request');
  res.status(status).json(createErrorResponse(status, message));
};

app.use(errorHandler);

module.exports = app;
// Export the error handler for direct testing
module.exports.errorHandler = errorHandler;
