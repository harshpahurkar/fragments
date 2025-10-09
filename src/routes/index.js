// src/routes/index.js
const express = require('express');
const router = express.Router();

// version and author from package.json
const { version, author } = require('../../package.json');

// Auth middleware and owner hashing
const { authenticate } = require('../auth');
const { hashUser } = require('../auth/hash-user');

// Protect all /v1/* routes and compute a hashed owner id on req.ownerId
router.use('/v1', authenticate(), hashUser, require('./api'));

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
