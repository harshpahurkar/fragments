const { createErrorResponse } = require('../../response');
const { deleteFragment } = require('../../model/fragments');

module.exports = async (req, res) => {
  const { id } = req.params;
  const owner =
    req.ownerId ||
    (req.user && (typeof req.user === 'string' ? req.user : req.user.username || req.user.email)) ||
    'anonymous';

  try {
    const ok = await deleteFragment(owner, id);
    if (!ok) return res.status(404).json(createErrorResponse(404, 'not found'));
    return res.status(204).send();
  } catch (err) {
    const logger = require('../../logger');
    logger.error({ err, owner, id }, 'unable to delete fragment');
    return res.status(500).json(createErrorResponse(500, 'unable to delete fragment'));
  }
};
