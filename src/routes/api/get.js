// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const { createSuccessResponse } = require('../../response');
const { listFragments } = require('../../model/fragments');

module.exports = async (req, res) => {
  const owner =
    req.ownerId ||
    (req.user && (typeof req.user === 'string' ? req.user : req.user.username || req.user.email)) ||
    'anonymous';
  const fragments = await listFragments(owner);
  res.status(200).json(createSuccessResponse({ fragments }));
};
