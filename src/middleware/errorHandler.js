function notFoundHandler(_req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
    },
  });
}

function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const hideMessage = status === 500;

  if (status >= 500) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: err.message,
      stack: err.stack,
    }));
  }

  res.status(status).json({
    success: false,
    error: {
      code: err.code || (status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR'),
      message: hideMessage ? 'Internal server error' : err.message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}

module.exports = { notFoundHandler, errorHandler };
