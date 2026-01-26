const prisma = require('../../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('../../utils/jwt')

exports.register = async (email, password) => {
  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      profile: { create: { username: `anon_${Date.now()}` } }
    }
  })

  return jwt.sign({ id: user.id, role: user.role })
}

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw { status: 401, message: 'Invalid credentials' }

  return jwt.sign({ id: user.id, role: user.role })
}
