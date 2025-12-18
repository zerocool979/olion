const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(new AppError(errors.array()[0].msg, 422));
  next();
};
