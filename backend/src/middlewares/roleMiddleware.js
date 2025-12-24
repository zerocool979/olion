exports.requireModerator = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'MODERATOR') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
