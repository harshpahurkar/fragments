// src/routes/api/post.js
const contentType = require('content-type');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { createFragment } = require('../../model/fragments');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    // Support text/* and application/json
    const type = req.headers['content-type'] || 'text/plain';
    const mime = contentType.parse(type).type;
    if (!(mime === 'application/json' || mime === 'text/plain' || mime.startsWith('text/'))) {
      return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
    }

    const owner =
      req.ownerId ||
      (req.user &&
        (typeof req.user === 'string' ? req.user : req.user.username || req.user.email)) ||
      'anonymous';

    // If req.body is a Buffer (raw parser), convert to string for text/* types
    // For JSON, store as a stringified JSON so metadata size calculations remain correct
    let content;
    if (Buffer.isBuffer(req.body)) {
      content = req.body.toString();
      if (mime === 'application/json') {
        // ensure valid JSON string (normalized)
        try {
          const obj = JSON.parse(content);
          content = JSON.stringify(obj);
        } catch (err) {
          logger.error({ err }, 'invalid json payload');
          return res.status(400).json(createErrorResponse(400, 'invalid json'));
        }
      }
    } else {
      if (mime === 'application/json') {
        // req.body may already be an object (if parsed). Normalize to string
        try {
          content =
            typeof req.body === 'string'
              ? JSON.stringify(JSON.parse(req.body))
              : JSON.stringify(req.body);
        } catch (err) {
          logger.error({ err }, 'invalid json payload');
          return res.status(400).json(createErrorResponse(400, 'invalid json'));
        }
      } else {
        content = req.body;
      }
    }
    const fragment = await createFragment(owner, { content, contentType: mime });

    // Build Location header
    const base =
      process.env.API_URL ||
      (req.headers.host ? `${req.protocol || 'http'}://${req.headers.host}` : '');
    if (base) {
      res.setHeader('Location', `${base}/v1/fragments/${fragment.id}`);
    }

    logger.info({ owner, id: fragment.id }, 'fragment created');
    res.status(201).json(createSuccessResponse({ fragment }));
  } catch (err) {
    logger.error({ err }, 'unable to create fragment');
    res.status(500).json(createErrorResponse(500, 'unable to process request'));
  }
};
