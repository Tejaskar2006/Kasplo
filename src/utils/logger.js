const levels = ['error', 'warn', 'info', 'debug'];

function createLogger(level = 'info') {
  const minIndex = Math.max(0, levels.indexOf(level));

  function log(method, message, meta) {
    if (levels.indexOf(method) > minIndex) {
      return;
    }
    const entry = {
      timestamp: new Date().toISOString(),
      level: method,
      message,
      ...(meta !== undefined ? { meta } : {}),
    };
    const line = JSON.stringify(entry);
    if (method === 'error') {
      console.error(line);
    } else {
      console.log(line);
    }
  }

  return {
    error: (message, meta) => log('error', message, meta),
    warn: (message, meta) => log('warn', message, meta),
    info: (message, meta) => log('info', message, meta),
    debug: (message, meta) => log('debug', message, meta),
  };
}

module.exports = { createLogger };
