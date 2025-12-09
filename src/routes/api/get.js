// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const { createSuccessResponse } = require('../../response');
const { listFragments } = require('../../model/fragments');

module.exports = async (req, res) => {
  try {
    const owner =
      req.ownerId ||
      (req.user && (typeof req.user === 'string' ? req.user : req.user.username || req.user.email)) ||
      'anonymous';
    const expand = req.query && (req.query.expand === '1' || req.query.expand === 'true');
    
    // Get tag filter from query params
    const tagFilter = req.query && req.query.tag;
    
    let fragments = await listFragments(owner, expand);

    // Filter by tag if provided
    if (tagFilter && expand) {
      // Only filter when expand=1 (we have full metadata with tags)
      const tagsToMatch = Array.isArray(tagFilter) ? tagFilter : [tagFilter];
      fragments = fragments.filter((f) => {
        // Check if fragment has tags and if any match the filter
        return f.tags && Array.isArray(f.tags) && f.tags.some((tag) => tagsToMatch.includes(tag));
      });
    }

    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};
