// src/routes/api/put.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { getFragmentMeta, updateFragment } = require('../../model/fragments');
const logger = require('../../logger');

/**
 * Update an existing fragment's data
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const owner =
      req.ownerId ||
      (req.user &&
        (typeof req.user === 'string' ? req.user : req.user.username || req.user.email)) ||
      'anonymous';

    // Check if fragment exists and belongs to this user
    const existingFragment = await getFragmentMeta(owner, id);
    if (!existingFragment) {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    // Get content type from request
    const contentType = req.headers['content-type'] || 'text/plain';

    // Validate that the content type matches the existing fragment's type
    if (contentType !== existingFragment.contentType) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            400,
            `Content-Type mismatch. Expected ${existingFragment.contentType}, got ${contentType}`
          )
        );
    }

    // Get the request body (should be raw bytes from rawBody middleware)
    let content;
    if (Buffer.isBuffer(req.body)) {
      content = req.body;
    } else if (typeof req.body === 'string') {
      content = req.body;
    } else {
      content = JSON.stringify(req.body);
    }

    // Parse tags from X-Tags header (comma-separated) or tags query param
    let tags = existingFragment.tags || [];
    const tagsHeader = req.headers['x-tags'];
    const tagsQuery = req.query.tags;

    if (tagsHeader !== undefined) {
      // X-Tags header is present (even if empty) - update tags
      tags =
        tagsHeader === ''
          ? []
          : tagsHeader
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t.length > 0);
    } else if (tagsQuery !== undefined) {
      tags = Array.isArray(tagsQuery)
        ? tagsQuery
        : tagsQuery
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
    }

    // Update the fragment
    const updatedFragment = await updateFragment(owner, id, content, tags);

    logger.info({ owner, id }, 'Fragment updated successfully');

    // Return the updated fragment metadata
    const response = {
      id: updatedFragment.id,
      ownerId: updatedFragment.owner,
      created: updatedFragment.created,
      updated: updatedFragment.updated,
      type: updatedFragment.contentType,
      size: updatedFragment.size,
      tags: updatedFragment.tags || [],
    };

    res.status(200).json(createSuccessResponse({ fragment: response }));
  } catch (err) {
    logger.error({ err }, 'Unable to update fragment');
    res.status(500).json(createErrorResponse(500, 'Unable to update fragment'));
  }
};
