const { hashEmail } = require('../hash');

function hashUser(req, res, next) {
  if (!req.user) return next();
  // req.user may be a string (email) or an object with email/username
  const email = typeof req.user === 'string' ? req.user : req.user.email || req.user.username;
  req.ownerId = hashEmail(email);
  return next();
}

module.exports = { hashUser };
