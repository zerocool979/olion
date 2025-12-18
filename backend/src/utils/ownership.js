const AppError = require('./AppError');

module.exports = (resourceUserId, currentUser) => {
  if (!resourceUserId) return;

  if (
    resourceUserId !== currentUser.id &&
    !['ADMIN', 'MODERATOR'].includes(currentUser.role)
  ) {
    throw new AppError('Forbidden: not resource owner', 403);
  }
};
