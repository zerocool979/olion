const prisma = require('../../config/prisma')

exports.hideDiscussion = id =>
  prisma.discussion.update({
    where: { id },
    data: { isHidden: true }
  })
