// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));
// Create a fragment (supports text/plain)
router.post('/fragments', require('./post'));
// Get a fragment by id
router.get('/fragments/:id', require('./getById'));
// Other routes (POST, DELETE, etc.) will go here later on...

module.exports = router;
