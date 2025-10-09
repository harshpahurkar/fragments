// jest.config.js

// Get the full path to our env.jest file
const path = require('path');
const envFile = path.join(__dirname, 'env.jest');

// Read the environment variables we use for Jest from our env.jest file
require('dotenv').config({ path: envFile });

// Set our Jest options, see http://localhost:8080
module.exports = {
  verbose: true,
  testTimeout: 5000,
  // Note: keep log guidance quiet during tests; use LOG_LEVEL in env.jest to control output
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
