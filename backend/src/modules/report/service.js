const prisma = require('../../config/prisma')

exports.create = (data, reporterId) =>
  prisma.report.create({
    data: { ...data, reporterId }
  })

exports.review = (id, status) =>
  prisma.report.update({
    where: { id },
    data: { status }
  })
