const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const logger = require('./logger');
const pinoHttp = require('pino-http')({ logger });
const authenticate = require('./auth');

const app = express();

app.use(pinoHttp);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

passport.use(authenticate.strategy());
app.use(passport.initialize());

app.use('/', require('./routes')); // includes /v1 with auth

app.use((req, res) => {
  res.status(404).json({ status: 'error', error: { message: 'not found', code: 404 } });
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';
  if (status > 499) logger.error({ err }, 'Error processing request');
  res.status(status).json({ status: 'error', error: { message, code: status } });
});

module.exports = app;
