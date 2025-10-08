// src/routes/api/post.js
const contentType = require('content-type');
const { createSuccessResponse } = require('../../response');
const { createFragment } = require('../../model/fragments');

module.exports = (req, res) => {
  // Only support text/plain for now
  const type = req.headers['content-type'] || 'text/plain';
  const mime = contentType.parse(type).type;
  if (mime !== 'text/plain') {
    return res
      .status(415)
      .json({ status: 'error', error: { message: 'unsupported media type', code: 415 } });
  }

  const owner = (req.user && (req.user.username || req.user.email)) || 'anonymous';
  const fragment = createFragment(owner, { content: req.body, contentType: mime });
  res.status(201).json(createSuccessResponse({ fragment }));
};
