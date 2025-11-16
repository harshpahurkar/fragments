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
  const expand = req.query && (req.query.expand === '1' || req.query.expand === 'true');
  const fragments = await listFragments(owner, expand);
  res.status(200).json(createSuccessResponse({ fragments }));
};
