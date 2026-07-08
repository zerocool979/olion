'use strict'
const prisma = require('../../config/prisma')

const REPORT_INCLUDE = {
  reporter: { select: { id: true, profile: { select: { username: true } } } },
  discussion: { select: { id: true, title: true } },
  comment:    { select: { id: true, content: true } },
}

exports.create = (data, reporterId) =>
  prisma.report.create({
    data: { ...data, reporterId },
    include: REPORT_INCLUDE,
  })

exports.findById = (id) =>
  prisma.report.findUnique({ where: { id } })

exports.review = (id, status) =>
  prisma.report.update({
    where: { id },
    data:  { status },
    include: REPORT_INCLUDE,
  })

exports.list = ({ status, skip = 0, take = 20 } = {}) =>
  prisma.report.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: 'desc' },
    skip,
    take,
    include: REPORT_INCLUDE,
  })


