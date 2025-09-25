// src/routes/index.js
const express = require('express');
const router = express.Router();

// version and author from package.json
const { version, author } = require('../../package.json');

// Auth middleware
const { authenticate } = require('../auth');

// Protect all /v1/* routes
router.use('/v1', authenticate(), require('./api'));

// Response helpers
const { createSuccessResponse } = require('../response');

// Health check
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(
    createSuccessResponse({
      author,
      githubUrl: 'https://github.com/harshpahurkar/fragments',
      version,
    })
  );
});

module.exports = router;
