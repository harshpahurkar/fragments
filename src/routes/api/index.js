// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const Fragment = require('../../model/fragment');

// per-route raw body parser for supported types
function rawBody() {
  return express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      try {
        const ct = req.headers['content-type'] || 'text/plain';
        return Fragment.isSupportedType(ct);
      } catch {
        return false;
      }
    },
  });
}

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));
// Create a fragment (supports text/plain)
router.post('/fragments', rawBody(), require('./post'));
// Get a fragment by id info (metadata)
router.get('/fragments/:id/info', require('./getInfo'));
// Get a fragment by id with extension support (e.g., .html converted from markdown)
router.get('/fragments/:id.:ext', require('./getByIdExt'));
// Get a fragment by id
router.get('/fragments/:id', require('./getById'));
// Other routes (POST, DELETE, etc.) will go here later on...

module.exports = router;
