// src/response.js

module.exports.createSuccessResponse = function (data) {
  if (!data) {
    return {
      status: 'ok',
    };
  }
  return {
    status: 'ok',
    ...data,
  };
};

module.exports.createErrorResponse = function (code, message) {
  return {
    status: 'error',
    error: {
      code: code,
      message: message,
    },
  };
};
