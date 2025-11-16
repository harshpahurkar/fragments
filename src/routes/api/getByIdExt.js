// src/routes/api/getByIdExt.js
const { createErrorResponse } = require('../../response');
const { getFragment } = require('../../model/fragments');

module.exports = async (req, res) => {
  const { id, ext } = req.params;
  const owner =
    req.ownerId ||
    (req.user && (typeof req.user === 'string' ? req.user : req.user.username || req.user.email)) ||
    'anonymous';

  const fragment = await getFragment(owner, id);
  if (!fragment) return res.status(404).json(createErrorResponse(404, 'not found'));

  // Support converting markdown to HTML when client requests .html
  if (ext === 'html') {
    // Only convert when content type is markdown-like
    const ct = fragment.contentType || '';
    if (ct.includes('markdown') || ct === 'text/markdown' || ct === 'text/x-markdown') {
      let md;
      try {
        // lazy require so server can still start if dependency isn't installed;
        // tests or runtime should install markdown-it as needed
        md = require('markdown-it')();
      } catch (e) {
        const logger = require('../../logger');
        logger.warn({ err: e }, 'markdown-it not available');
        // markdown-it not installed
        return res.status(500).json(createErrorResponse(500, 'markdown support not available'));
      }
      const rendered = md.render(
        typeof fragment.content === 'string' ? fragment.content : String(fragment.content)
      );
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(rendered);
    }
    // If not markdown, return 415 unsupported media type
    return res
      .status(415)
      .json(createErrorResponse(415, 'cannot convert fragment to requested format'));
  }

  // If extension isn't handled, return 400
  return res.status(400).json(createErrorResponse(400, 'unsupported extension'));
};
