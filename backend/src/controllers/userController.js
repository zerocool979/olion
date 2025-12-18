const userService = require('../services/userService');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (e) {
    next(e);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const user = await userService.updateRole(
      req.params.id,
      req.body.role
    );
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.toggleActive = async (req, res, next) => {
  try {
    const user = await userService.toggleActive(req.params.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.updateMyProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.json(user);
  } catch (e) {
    next(e);
  }
};
