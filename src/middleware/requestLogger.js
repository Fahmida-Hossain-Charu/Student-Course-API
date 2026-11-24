const { randomUUID } = require('crypto');

function requestLogger(logger = console) {
  return (req, res, next) => {
    req.id = req.get('X-Request-ID') || randomUUID();
    res.set('X-Request-ID', req.id);

    const startedAt = Date.now();
    res.on('finish', () => {
      logger.info(`${req.id} ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`);
    });
    next();
  };
}

module.exports = requestLogger;
