// src/routes/api/getInfo.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { getFragmentMeta } = require('../../model/fragments');

module.exports = async (req, res) => {
  const { id } = req.params;
  const owner =
    req.ownerId ||
    (req.user && (typeof req.user === 'string' ? req.user : req.user.username || req.user.email)) ||
    'anonymous';
  const meta = await getFragmentMeta(owner, id);
  if (!meta) return res.status(404).json(createErrorResponse(404, 'not found'));
  res.status(200).json(createSuccessResponse({ fragment: meta }));
};
