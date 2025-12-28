module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;

  console.error('🔥 GLOBAL ERROR:', err);
  res.status(status).json({
    success: false,
    message: err.isOperational
      ? err.message
      : 'Internal Server Error',
  });
};
