'use strict'
const prisma = require('../../config/prisma')

exports.hideDiscussion = (id) =>
  prisma.discussion.update({ where: { id }, data: { isHidden: true } })

exports.unhideDiscussion = (id) =>
  prisma.discussion.update({ where: { id }, data: { isHidden: false } })

exports.hideComment = (id) =>
  prisma.comment.update({ where: { id }, data: { isHidden: true } })

exports.unhideComment = (id) =>
  prisma.comment.update({ where: { id }, data: { isHidden: false } })

exports.banUser = (id) =>
  prisma.user.update({ where: { id }, data: { isBanned: true } })

exports.unbanUser = (id) =>
  prisma.user.update({ where: { id }, data: { isBanned: false } })


