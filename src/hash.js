// src/hash.js
const crypto = require('crypto');

function hashEmail(email) {
  if (!email) return null;
  return crypto.createHash('sha256').update(email).digest('hex');
}

module.exports = { hashEmail };
