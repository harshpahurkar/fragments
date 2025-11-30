// src/model/data/index.js
// If the environment sets an AWS Region, we'll use AWS backend
// services (S3, DynamoDB); otherwise, we'll use an in-memory db.
// Prefer the in-memory adapter while running unit tests (NODE_ENV=test).
// Use AWS adapter only when AWS_REGION is set and we're NOT in test mode.
module.exports =
  process.env.AWS_REGION && process.env.NODE_ENV !== 'test'
    ? require('./aws')
    : require('./memory');
