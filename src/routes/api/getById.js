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
  // If the fragment is JSON, return parsed JSON with proper header
  if (fragment.contentType === 'application/json') {
    res.setHeader('Content-Type', 'application/json');
    try {
      // fragment.content may be a Buffer (from S3), a string, or already an object.
      let obj;
      if (Buffer.isBuffer(fragment.content)) {
        // Convert Buffer -> string -> object
        obj = JSON.parse(fragment.content.toString());
      } else if (typeof fragment.content === 'string') {
        obj = JSON.parse(fragment.content);
      } else {
        obj = fragment.content;
      }
      return res.status(200).json(obj);
    } catch (err) {
      // fall back to raw string if parse fails
      const logger = require('../../logger');
      logger.warn({ err }, 'failed to parse stored JSON, returning raw content');
      // return raw content as text to avoid advertising application/json when it is invalid
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(fragment.content);
    }
  }

  if (fragment.contentType === 'text/plain' || fragment.contentType.startsWith('text/')) {
    res.setHeader('Content-Type', fragment.contentType);
    return res.status(200).send(fragment.content);
  }

  // Otherwise return the metadata
  res.status(200).json(createSuccessResponse({ fragment }));
};
