const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || (err.statusCode >= 400 ? err.statusCode : 500);
  const message = err.expose || status < 500 ? err.message : 'Internal server error';
  if (status >= 500) console.error('[error]', err.stack || err.message);
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({ success: false, message: details.join(', ') });
  }
  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };