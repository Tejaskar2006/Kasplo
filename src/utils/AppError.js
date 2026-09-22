class AppError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = options.statusCode ?? 400;
    this.code = options.code ?? 'REQUEST_ERROR';
    this.details = options.details;
  }
}

module.exports = { AppError };
