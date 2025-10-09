// src/routes/api/getById.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { getFragment } = require('../../model/fragments');

module.exports = async (req, res) => {
  const { id } = req.params;
  const owner =
    req.ownerId ||
    (req.user && (typeof req.user === 'string' ? req.user : req.user.username || req.user.email)) ||
    'anonymous';
  const fragment = await getFragment(owner, id);
  if (!fragment) return res.status(404).json(createErrorResponse(404, 'not found'));

  // If the client wants the raw content (e.g., text/plain), return it directly
  if (fragment.contentType === 'text/plain') {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(fragment.content);
  }

  // Otherwise return the metadata
  res.status(200).json(createSuccessResponse({ fragment }));
};
